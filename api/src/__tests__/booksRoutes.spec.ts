import request from 'supertest';
import express from 'express';
import books from '../routes/booksRoutes';
import { MockContext, Context, createMockContext } from '../config/context';
import { prismaMock } from '../config/singleton';
import { notifyUserAvailableForPickup } from '../utils/sendEmail';

const app = express();
app.use(express.json());
app.use(books);

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

jest.mock('../utils/sendEmail', () => ({
  notifyUserAvailableForPickup: jest.fn(),
}));

describe('GET /books', () => {
  it('should return 200 and a list of books when the search is valid', async () => {
    const mockBooks = [
      {
        id: 'cm33jqb4l0001wa2i6mom3xh7',
        title: 'Harry Potter',
        author: 'J.K. Rowling',
        available: true,
        isbn: '1234567890',
        category: 'Ficção',
        createdAt: new Date(),
      },
      {
        id: 'cm33jp7e4000731x98t8gerws',
        title: 'O Senhor dos Anéis',
        author: 'J.R.R. Tolkien',
        available: false,
        isbn: '0987654321',
        category: 'Ficção Fantástica',
        createdAt: new Date(),
      },
    ];

    prismaMock.books.findMany.mockResolvedValue(mockBooks);

    const response = await request(app).get('/books');

    expect(response.status).toBe(200);

    const expectedResponse = mockBooks.map((book) => ({
      ...book,
      createdAt: book.createdAt.toISOString(),
    }));

    expect(response.body).toEqual(expectedResponse);
  });

  it('should return 200 and a list of books when a valid type is provided', async () => {
    const mockBooks = [
      {
        id: 'cm33jqb4l0001wa2i6mom3xh7',
        title: 'Harry Potter',
        author: 'J.K. Rowling',
        available: true,
        isbn: '1234567890',
        category: 'Ficção',
        createdAt: new Date(),
      },
    ];

    prismaMock.books.findMany.mockResolvedValue(mockBooks);

    const response = await request(app).get('/books?search=Harry&type=title');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      mockBooks.map((book) => ({
        ...book,
        createdAt: book.createdAt.toISOString(),
      }))
    );
  });

  it('should return 500 in case of error when searching for books', async () => {
    prismaMock.books.findMany.mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await request(app).get('/books');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Erro ao buscar Livros');
  });
});

describe('POST /books/reserve/:id', () => {
  const user = {
    id: '123abc',
    username: 'username',
    password: 'hashedPassword',
    name: 'user',
    email: 'abc@gmail.com',
    createdAt: new Date(),
  };

  const user2 = {
    id: '456def',
    username: 'username2',
    password: 'hashedPassword2',
    name: 'user2',
    email: 'def@gmail.com',
    createdAt: new Date(),
  };

  const book = {
    id: 'cm33jqb4l0001wa2i6mom3xh7',
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    available: true,
    isbn: '1234567890',
    category: 'Ficção',
    createdAt: new Date(),
  };

  const reservation = {
    id: 'asdasdg0001wa2i6mom3xh',
    userId: 'cm21jasdf4l0001wa2i6mom3xh7',
    bookId: 'cm33jqb4l0001wa2i6mom3xh32',
    queueReservation: ['cm33jqb4l00qwa2i6mom3xh32', 'cm33jqb4l00qwa2sdf43m3xh32'],
    createdAt: new Date(),
  };

  it('should return 200 and reserve an available book', async () => {
    prismaMock.books.findUnique.mockResolvedValue(book);
    prismaMock.reservation.findFirst.mockResolvedValue(null);
    prismaMock.reservation.create.mockResolvedValue({
      ...reservation,
      userId: user.id,
      bookId: book.id,
    });
    prismaMock.books.update.mockResolvedValue({
      ...book,
      available: false,
    });

    const response = await request(app).post(`/books/reserve/${book.id}`).send({ userId: user.id });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Livro reservado com sucesso');
    expect(response.body).toHaveProperty('reservation');
    expect(prismaMock.books.update).toHaveBeenCalledWith({
      where: { id: book.id },
      data: { available: false },
    });
  });

  it('should return 400 if the user has already reserved the book', async () => {
    prismaMock.books.findUnique.mockResolvedValue(book);
    prismaMock.reservation.findFirst.mockResolvedValue({ ...reservation, userId: user.id, bookId: book.id });

    const response = await request(app).post(`/books/reserve/${book.id}`).send({ userId: user.id });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Você já reservou este livro');
  });

  it('should return 404 if the book is not found', async () => {
    prismaMock.books.findUnique.mockResolvedValue(null);

    const response = await request(app).post(`/books/reserve/${book.id}`).send({ userId: user.id });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Livro não encontrado');
  });

  it('should add the user to the queue if the book is not available', async () => {
    prismaMock.books.findUnique.mockResolvedValue({ ...book, available: false });
    prismaMock.reservation.findFirst.mockResolvedValue({
      ...reservation,
      bookId: book.id,
      userId: user.id,
      queueReservation: [user.id], // Apenas `user` está na fila inicialmente
    });
    prismaMock.reservation.update.mockResolvedValue({
      ...reservation,
      queueReservation: [...reservation.queueReservation, user2.id],
    });

    const response = await request(app).post(`/books/reserve/${book.id}`).send({ userId: user2.id });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Você foi adicionado à fila para este livro');
    expect(response.body.reservation.queueReservation).toContain(user2.id);
  });

  it('should return 500 in case of unexpected error', async () => {
    prismaMock.books.findUnique.mockRejectedValue(new Error('Erro inesperado'));

    const response = await request(app).post(`/books/reserve/${book.id}`).send({ userId: user.id });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Erro ao reservar livro');
  });
});

describe('POST /books/refund/:id', () => {
  const book = {
    id: 'cm33jqb4l0001wa2i6mom3xh7',
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    available: false,
    isbn: '1234567890',
    category: 'Ficção',
    createdAt: new Date(),
    reservations: [],
  };

  const reservation = {
    id: 'asdasdg0001wa2i6mom3xh',
    userId: '123abc',
    bookId: book.id,
    queueReservation: [],
    createdAt: new Date(),
  };

  beforeEach(() => {
    prismaMock.books.findUnique.mockClear();
    prismaMock.reservation.findFirst.mockClear();
    prismaMock.reservation.update.mockClear();
    prismaMock.reservation.delete.mockClear();
  });

  it('should return 404 if the book is not found', async () => {
    prismaMock.books.findUnique.mockResolvedValue(null);

    const response = await request(app).post(`/books/refund/${book.id}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Livro não encontrado');
  });

  it('should return 404 if there is no active reservation for the book', async () => {
    prismaMock.books.findUnique.mockResolvedValue(book);
    prismaMock.reservation.findFirst.mockResolvedValue(null);

    const response = await request(app).post(`/books/refund/${book.id}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Reserva não encontrada para este usuário');
  });

  it('should process the return and remove the reservation if there is no queue', async () => {
    prismaMock.books.findUnique.mockResolvedValue(book);
    prismaMock.reservation.findFirst.mockResolvedValue(reservation);
    prismaMock.reservation.delete.mockResolvedValue(reservation);

    const response = await request(app).post(`/books/refund/${book.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Devolução processada com sucesso!');
    expect(prismaMock.reservation.delete).toHaveBeenCalledWith({
      where: { id: reservation.id },
    });
  });

  it('must transfer the reservation to the next user in line if there is a waiting list', async () => {
    const nextUser = {
      id: '456def',
      username: 'username2',
      password: 'hashedPassword2',
      name: 'user2',
      email: 'def@gmail.com',
      createdAt: new Date(),
    };
    const reservationWithQueue = {
      ...reservation,
      queueReservation: [nextUser.id],
    };

    prismaMock.books.findUnique.mockResolvedValue(book);
    prismaMock.reservation.findFirst.mockResolvedValue(reservationWithQueue);
    prismaMock.reservation.update.mockResolvedValue({
      ...reservationWithQueue,
      userId: nextUser.id,
      queueReservation: [],
    });
    prismaMock.users.findUnique.mockResolvedValue(nextUser);
    (notifyUserAvailableForPickup as jest.Mock).mockResolvedValueOnce(undefined);

    const response = await request(app).post(`/books/refund/${book.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Devolução processada com sucesso!');
    expect(prismaMock.reservation.update).toHaveBeenCalledWith({
      where: { id: reservation.id },
      data: {
        userId: nextUser.id,
        bookId: book.id,
        queueReservation: [],
      },
    });
    expect(notifyUserAvailableForPickup).toHaveBeenCalledWith(nextUser.email, book.title, nextUser.name);
  });

  it('should return 500 in case of unexpected error', async () => {
    prismaMock.books.findUnique.mockRejectedValue(new Error('Erro inesperado'));

    const response = await request(app).post(`/books/refund/${book.id}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Erro ao reservar livro');
  });
});
