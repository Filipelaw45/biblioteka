import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import prisma from './prisma/prismaClient';
import { sendEmail } from './mailer'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.users.findFirst({
      where: { username, password_hash: password },
    });
    if (user) {
      res.status(200).json({
        token: 'token-ficticio',
        user: {
          name: user.name,
          id: user.id,
        },
      });
      console.log(user.id);
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

app.post('/books/reserve/:id', async (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id);
  const { userId } = req.body; // Receber o userId do corpo da requisição

  try {
    // Verifica se o livro existe e está disponível
    const book = await prisma.books.findUnique({
      where: { id: bookId },
    });

    // Cria a reserva
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        bookId,
      },
    });

    // Atualiza o status do livro
    await prisma.books.update({
      where: { id: bookId },
      data: { available: false },
    });

    // Envia o e-mail de confirmação
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (user) {
      const subject = `Reserva confirmada: ${book?.title}`;
      const text = `Olá ${user.name},\n\nSua reserva para o livro "${book?.title}" foi confirmada.\n\nObrigado!`;
      await sendEmail(user.email, subject, text); // Enviando o e-mail
    }

    res.status(200).json({ message: 'Livro reservado com sucesso', reservation });
  } catch (err) {
    console.error('Error reserving book:', err);
    res.status(500).json({ message: 'Erro ao reservar livro', error: err });
  }
});


app.get('/users/:id/reservations', async (req, res) => {
  const userId = parseInt(req.params.id);
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

app.delete('/reservations/:id', async (req: Request, res: Response) => {
  const reservationId = parseInt(req.params.id);
  
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId }
    });

    await prisma.reservation.delete({
      where: { id: reservationId }
    });

    await prisma.books.update({
      where: { id: reservation?.bookId },
      data: { available: true }
    });

    res.status(200).json({ message: 'Reservation canceled successfully' });
  } catch (err) {
    console.error('Error canceling reservation:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
