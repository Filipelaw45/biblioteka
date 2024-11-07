import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/prismaClient';

const router = Router();

async function login(req: Request, res: Response): Promise<Response> {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Bad Request' });

  try {
    const user = await prisma.users.findFirst({ where: { username } });

    if (!user) return res.status(404).json({ message: 'Usuário ou senha inválidos' });

    if (await bcrypt.compare(password, user.password)) {
      return res.status(200).json({
        token: 'token-ficticio',
        user: {
          name: user.name,
          id: user.id,
        },
      });
    } else {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server Error' });
  } finally {
    await prisma.$disconnect();
  }
}

router.post('/login', async (req: Request, res: Response) => {
  await login(req, res);
});

export default router;
