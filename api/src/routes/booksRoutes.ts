import express, { Request, Response } from 'express';
import prisma from '../config/prismaClient';
import { notifyReserve, notifyUserAvailableForPickup } from '../utils/sendEmail';

const router = express.Router();

async function getBooks(req: Request, res: Response) {
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

    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar Livros', error: err });
  }
}

async function reserveBooks(req: Request, res: Response) {
  const bookId = req.params.id;
  const { userId } = req.body;

  try {
    const book = await prisma.books.findUnique({
      where: { id: bookId },
    });

    if (!book) return res.status(404).json({ message: 'Livro não encontrado' });

    const activeReservation = await prisma.reservation.findFirst({
      where: { bookId, userId },
    });

    if (activeReservation?.userId === userId || activeReservation?.queueReservation.includes(userId)) {
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

      return res
        .status(200)
        .json({ message: `Você foi adicionado à fila para este livro. Sua posição atual é ${position}`, reservation });
    }

    return res.status(200).json({ message: 'Livro reservado com sucesso', reservation });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao reservar livro', error: err });
  }
}

async function refundBooks(req: Request, res: Response) {
  const bookId = req.params.id;

  try {
    const book = await prisma.books.findUnique({
      where: { id: bookId },
      include: { reservations: true },
    });

    if (!book) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }

    const reservation = await prisma.reservation.findFirst({
      where: { bookId },
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva não encontrada para este usuário' });
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

    return res.status(200).json({ message: 'Devolução processada com sucesso!' });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao reservar livro', error: err });
  }
}

router.get('/books', async (req, res) => {
  await getBooks(req, res);
});

router.post('/books/reserve/:id', async (req, res) => {
  await reserveBooks(req, res);
});

router.post('/books/refund/:id', async (req, res) => {
  await refundBooks(req, res);
});

export default router;
