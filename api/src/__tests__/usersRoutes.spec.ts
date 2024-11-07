import request from 'supertest';
import express from 'express';
import users from '../routes/usersRoutes';
import { MockContext, Context, createMockContext } from '../config/context';
import { prismaMock } from '../config/singleton';

const app = express();
app.use(express.json());
app.use(users);

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

describe('GET /users/:userid/reservations', () => {
  const user = {
    id: '123abc',
    username: 'username',
    password: 'hashedPassword',
    name: 'user',
    email: 'abc@gmail.com',
    createdAt: new Date(),
  };

  const book = {
    id: 'book123',
    title: 'Some Book Title',
    author: 'Author Name',
    available: true,
    isbn: '1234567890',
    category: 'Fiction',
    createdAt: new Date(),
  };

  const reservations = [
    {
      id: 'reservation123',
      userId: user.id,
      bookId: book.id,
      createdAt: new Date(),
      queueReservation: [],
    },
  ];

  it('deve retornar 200 e uma lista de reservas do usuário', async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);
    prismaMock.reservation.findMany.mockResolvedValue(reservations);

    const response = await request(app).get(`/users/${user.id}/reservations`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const reservation = response.body[0];
    expect(reservation).toHaveProperty('id');
    expect(reservation).toHaveProperty('userId');
    expect(reservation).toHaveProperty('bookId');
  });

  it('deve retornar 200 e uma mensagem se o usuário não possui reservas', async () => {
    prismaMock.users.findUnique.mockResolvedValue(user);
    prismaMock.reservation.findMany.mockResolvedValue([]);

    const response = await request(app).get(`/users/${user.id}/reservations`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Nenhuma reserva encontrada para este usuário');
  });

  it('deve retornar 404 se o usuário não for encontrado', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    const response = await request(app).get(`/users/${user.id}/reservations`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
  });

  it('deve retornar 500 em caso de erro interno', async () => {
    prismaMock.users.findUnique.mockRejectedValue(new Error('Erro interno'));

    const response = await request(app).get(`/users/${user.id}/reservations`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Erro ao buscar reservas do usuário');
  });
});
