import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password_hash = $2', [
      username,
      password,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json({ token: 'token-ficticio' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

app.get('/books', async (req, res) => {
  const { search = '', type = 'title' } = req.query;
  try {
    const query = `
      SELECT * FROM books
      WHERE LOWER(${type}) LIKE $1
    `;
    const result = await pool.query(query, [`%${search.toString().toLowerCase()}%`]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

app.post('/books/reserve/:id', async (req, res) => {
  const bookId = parseInt(req.params.id);
  
  try {
    const result = await pool.query('UPDATE books SET available = false WHERE id = $1 AND available = true RETURNING *', [bookId]);
    
    if (result.rowCount! > 0) {
      res.status(200).json({ message: 'Livro reservado com sucesso', book: result.rows[0] });
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
