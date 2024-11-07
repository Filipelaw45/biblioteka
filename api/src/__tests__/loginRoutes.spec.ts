import request from 'supertest';
import login from '../routes/loginRoutes';
import express from 'express';
import { MockContext, Context, createMockContext } from '../config/context';
import { prismaMock } from '../config/singleton';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use(login);

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

describe('POST /login', () => {
  it('should return 200, a token and user when credentials are valid', async () => {
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = {
      id: '123abc',
      username: 'username',
      password: hashedPassword,
      name: 'user',
      email: 'abc@gmail.com',
      createdAt: new Date(),
    };

    prismaMock.users.findFirst.mockResolvedValue(user);

    const response = await request(app).post('/login').send({ username: user.username, password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('name', user.name);
  });

  it('should return 400 when username or password is missing', async () => {
    const responseMissingUser = await request(app).post('/login').send({ password: 'password' });
    expect(responseMissingUser.status).toBe(400);
    expect(responseMissingUser.body).toHaveProperty('message', 'Bad Request');

    const responseMissingPassword = await request(app).post('/login').send({ username: 'username' });
    expect(responseMissingPassword.status).toBe(400);
    expect(responseMissingPassword.body).toHaveProperty('message', 'Bad Request');
  });

  it('should return 404 when user does not exist', async () => {
    prismaMock.users.findFirst.mockResolvedValue(null);

    const response = await request(app).post('/login').send({ username: 'nonexistent', password: 'password' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Usuário ou senha inválidos');
  });

  it('should return 500 when there is an internal server error', async () => {
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = {
      id: '123abc',
      username: 'username',
      password: hashedPassword,
      name: 'user',
      email: 'abc@gmail.com',
      createdAt: new Date(),
    };

    prismaMock.users.findFirst.mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await request(app).post('/login').send({ username: user.username, password });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal server Error');
  });

  it('should return 401 when password is incorrect', async () => {
    const password = 'password';
    const hashedPassword = await bcrypt.hash('wrongpassword', 8); // hashed wrong password

    const user = {
      id: '123abc',
      username: 'username',
      password: hashedPassword,
      name: 'user',
      email: 'abc@gmail.com',
      createdAt: new Date(),
    };

    prismaMock.users.findFirst.mockResolvedValue(user);

    const response = await request(app).post('/login').send({ username: user.username, password });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Usuário ou senha inválidos');
  });
});
