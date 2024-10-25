import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import prisma from './prisma/prismaClient';

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
      res.status(200).json({ token: 'token-ficticio' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});


app.get('/books', async (req, res) => {
  const { search = '', type } = req.query;

  // Verifica se `type` é uma string e se está entre os tipos válidos
  const validTypes = ['title', 'author']; // Adicione outras propriedades válidas aqui
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


app.post('/books/reserve/:id', async (req, res) => {
  const bookId = parseInt(req.params.id);
  try {
    const book = await prisma.books.updateMany({
      where: { id: bookId, available: true },
      data: { available: false },
    });
    
    if (book.count > 0) {
      const updatedBook = await prisma.books.findUnique({ where: { id: bookId } });
      res.status(200).json({ message: 'Livro reservado com sucesso', book: updatedBook });
    } else {
      res.status(404).json({ message: 'Livro não encontrado ou já reservado' });
    }
  } catch (err) {
    console.error('Error reserving book:', err);
    res.status(500).json({ message: 'Erro ao reservar livro', error: err });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
