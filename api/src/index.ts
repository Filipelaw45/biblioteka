import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import login from './routes/loginRoutes';
import books from './routes/booksRoutes';
import users from './routes/usersRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(login);
app.use(books);
app.use(users);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
