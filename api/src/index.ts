import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/prismaClient';
import bcrypt from 'bcrypt';
import { notifyReserve, notifyUserAvailableForPickup } from './utils/sendEmail';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.users.findFirst({
      where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        token: 'token-ficticio',
        user: {
          name: user.name,
          id: user.id,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

app.get('/books', async (req, res) => {
  const { search = '', type } = req.query;

  const validTypes = ['title', 'author', 'isbn', 'category'];
  const searchType = typeof type === 'string' && validTypes.includes(type) ? type : 'title';

  try {
    const books = await prisma.books.findMany({
      where: {
        [searchType]: {
          contains: search.toString().toLowerCase(),
          mode: 'insensitive',
        },
      },
    });
    res.status(200).json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

app.post('/books/reserve/:id', async (req: any, res: any) => {
  const bookId = req.params.id;
  const { userId } = req.body;

  try {
    const book = await prisma.books.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }

    const activeReservation = await prisma.reservation.findFirst({
      where: { bookId, userId },
    });

    console.log(activeReservation);

    if (activeReservation) {
      return res.status(400).json({ message: 'Você já reservou este livro' });
    }

    let reservation;
    if (book.available) {
      reservation = await prisma.reservation.create({
        data: {
          userId,
          bookId,
        },
      });

      await prisma.books.update({
        where: { id: bookId },
        data: { available: false },
      });

      const user = await prisma.users.findUnique({ where: { id: userId } });
      if (user) await notifyReserve(user.email, book.title, user.name);
    } else {
      const existingReservation = await prisma.reservation.findFirst({
        where: { bookId },
      });

      if (!existingReservation) {
        reservation = await prisma.reservation.create({
          data: {
            userId,
            bookId,
            queueReservation: [],
          },
        });
      } else {
        if (existingReservation.queueReservation.includes(userId)) {
          return res.status(400).json({ message: 'Você já está na fila para este livro' });
        }

        reservation = await prisma.reservation.update({
          where: { id: existingReservation.id },
          data: {
            queueReservation: {
              push: userId,
            },
          },
        });
      }
      const position = reservation.queueReservation.indexOf(userId) + 1;

      res
        .status(200)
        .json({ message: `Você foi adicionado à fila para este livro. Sua posição atual é ${position}`, reservation });
      return;
    }

    res.status(200).json({ message: 'Livro reservado com sucesso', reservation });
  } catch (err) {
    console.error('Error reserving book:', err);
    res.status(500).json({ message: 'Erro ao reservar livro', error: err });
  }
});

app.post('/books/refund/:id', async (req: any, res: any) => {
  const bookId = req.params.id;

  try {
    const book = await prisma.books.findUnique({
      where: { id: bookId },
      include: { reservations: true },
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const reservation = await prisma.reservation.findFirst({
      where: { bookId },
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found for this user' });
    }

    if (reservation.queueReservation.length > 0) {
      const nextUserId = reservation.queueReservation[0];

      await prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          userId: nextUserId,
          bookId: bookId,
          queueReservation: reservation.queueReservation.slice(1),
        },
      });

      const user = await prisma.users.findUnique({ where: { id: nextUserId } });
      if (user) await notifyUserAvailableForPickup(user.email, book.title, user.name);
    } else {
      await prisma.reservation.delete({
        where: { id: reservation.id },
      });
    }

    res.status(200).json({ message: 'Refund processed successfully' });
  } catch (err) {
    console.error('Error refund book:', err);
    res.status(500).json({ message: 'Erro ao reservar livro', error: err });
  }
});

app.get('/users/:userid/reservations', async (req, res) => {
  const userId = req.params.userid;
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: { book: true },
    });
    res.status(200).json(reservations);
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

app.delete('/reservations/:id', async (req, res) => {
  const reservationId = req.params.id;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    await prisma.reservation.delete({
      where: { id: reservationId },
    });

    await prisma.books.update({
      where: { id: reservation?.bookId },
      data: { available: true },
    });

    res.status(200).json({ message: 'Reservation canceled successfully' });
  } catch (err) {
    console.error('Error canceling reservation:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
