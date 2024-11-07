import express, { Request, Response } from 'express';
import prisma from '../config/prismaClient';

const router = express.Router();

async function getUserReservations(req: Request, res: Response) {
  const userId = req.params.userid;

  try {
    const userExists = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!userExists) return res.status(404).json({ message: 'Usuário não encontrado' });

    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: { book: true },
    });

    if (reservations.length === 0) {
      return res.status(200).json({ message: 'Nenhuma reserva encontrada para este usuário' });
    }
    return res.status(200).json(reservations);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar reservas do usuário' });
  }
}

router.get('/users/:userid/reservations', async (req, res) => {
  await getUserReservations(req, res);
});

export default router;
