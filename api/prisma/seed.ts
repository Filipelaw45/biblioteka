import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const booksData = [
  {
    title: 'O Senhor dos Anéis',
    author: 'J.R.R. Tolkien',
    available: true,
    isbn: '9788521621550',
    category: 'Ficção Fantástica',
  },
  { title: '1984', author: 'George Orwell', available: true, isbn: '9780451524935', category: 'Distopia' },
  {
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    available: true,
    isbn: '9788520910440',
    category: 'Literatura Brasileira',
  },
  {
    title: 'A Revolução dos Bichos',
    author: 'George Orwell',
    available: true,
    isbn: '9788535920951',
    category: 'Fábula',
  },
  { title: 'Moby Dick', author: 'Herman Melville', available: true, isbn: '9781503280786', category: 'Aventura' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', available: true, isbn: '9781503290563', category: 'Romance' },
  {
    title: 'Cem Anos de Solidão',
    author: 'Gabriel García Márquez',
    available: true,
    isbn: '9788535923203',
    category: 'Realismo Mágico',
  },
  { title: 'A Metamorfose', author: 'Franz Kafka', available: true, isbn: '9788573020990', category: 'Ficção' },
  {
    title: 'O Morro dos Ventos Uivantes',
    author: 'Emily Brontë',
    available: true,
    isbn: '9788535931443',
    category: 'Romance',
  },
  { title: 'Guerra e Paz', author: 'Liev Tolstói', available: true, isbn: '9788535920202', category: 'Histórico' },
  {
    title: 'O Sol é Para Todos',
    author: 'Harper Lee',
    available: true,
    isbn: '9788535920387',
    category: 'Literatura Americana',
  },
  {
    title: 'O Apanhador no Campo de Centeio',
    author: 'J.D. Salinger',
    available: true,
    isbn: '9788535901456',
    category: 'Ficção',
  },
  { title: 'A Arte da Guerra', author: 'Sun Tzu', available: true, isbn: '9788535932038', category: 'Estratégia' },
  {
    title: 'O Corcunda de Notre-Dame',
    author: 'Victor Hugo',
    available: true,
    isbn: '9788595083504',
    category: 'Romance',
  },
  {
    title: 'A Menina que Roubava Livros',
    author: 'Markus Zusak',
    available: true,
    isbn: '9788466343539',
    category: 'Ficção Histórica',
  },
  { title: 'O Nome da Rosa', author: 'Umberto Eco', available: true, isbn: '9788573020166', category: 'Mistério' },
  { title: 'O Código Da Vinci', author: 'Dan Brown', available: true, isbn: '9780307474278', category: 'Thriller' },
  {
    title: 'O Silmarillion',
    author: 'J.R.R. Tolkien',
    available: true,
    isbn: '9788551002487',
    category: 'Ficção Fantástica',
  },
  {
    title: 'A Casa dos Espíritos',
    author: 'Isabel Allende',
    available: true,
    isbn: '9788535920172',
    category: 'Realismo Mágico',
  },
  { title: 'Os Miseráveis', author: 'Victor Hugo', available: true, isbn: '9788573020142', category: 'Romance' },
  { title: 'O Lobo da Estepe', author: 'Hermann Hesse', available: true, isbn: '9788535932007', category: 'Ficção' },
  {
    title: 'A Montanha Mágica',
    author: 'Thomas Mann',
    available: true,
    isbn: '9788575031888',
    category: 'Literatura Alemã',
  },
  { title: 'O Estrangeiro', author: 'Albert Camus', available: true, isbn: '9788535920493', category: 'Ficção' },
  { title: 'O Processo', author: 'Franz Kafka', available: true, isbn: '9788535921377', category: 'Ficção' },
  {
    title: 'O Guia do Mochileiro das Galáxias',
    author: 'Douglas Adams',
    available: true,
    isbn: '9788535925344',
    category: 'Ficção Científica',
  },
  { title: 'Catcher in the Rye', author: 'J.D. Salinger', available: true, isbn: '9780316769488', category: 'Ficção' },
  { title: 'O Velho e o Mar', author: 'Ernest Hemingway', available: true, isbn: '9788535930164', category: 'Ficção' },
  {
    title: 'As Aventuras de Tom Sawyer',
    author: 'Mark Twain',
    available: true,
    isbn: '9788535920805',
    category: 'Aventura',
  },
  {
    title: 'A Insustentável Leveza do Ser',
    author: 'Milan Kundera',
    available: true,
    isbn: '9788535921390',
    category: 'Romance',
  },
  { title: 'Brave New World', author: 'Aldous Huxley', available: true, isbn: '9780060850524', category: 'Distopia' },
  {
    title: 'O Retrato de Dorian Gray',
    author: 'Oscar Wilde',
    available: true,
    isbn: '9788573020562',
    category: 'Ficção',
  },
  { title: 'A Divina Comédia', author: 'Dante Alighieri', available: true, isbn: '9788535920003', category: 'Poesia' },
  {
    title: 'A Metafísica dos Costumes',
    author: 'Immanuel Kant',
    available: true,
    isbn: '9788535920577',
    category: 'Filosofia',
  },
  {
    title: 'A História Sem Fim',
    author: 'Michael Ende',
    available: true,
    isbn: '9788535923967',
    category: 'Ficção Fantástica',
  },
  {
    title: 'O Livro do Desassossego',
    author: 'Fernando Pessoa',
    available: true,
    isbn: '9788535921802',
    category: 'Poesia',
  },
  {
    title: 'O Homem Invisível',
    author: 'H.G. Wells',
    available: true,
    isbn: '9788535921383',
    category: 'Ficção Científica',
  },
  { title: 'A Cor Púrpura', author: 'Alice Walker', available: true, isbn: '9788535921338', category: 'Ficção' },
  {
    title: 'O Último dos Moicanos',
    author: 'James Fenimore Cooper',
    available: true,
    isbn: '9788535925169',
    category: 'Aventura',
  },
  {
    title: 'A História da Literatura',
    author: 'Umberto Eco',
    available: true,
    isbn: '9788535930249',
    category: 'Não-ficção',
  },
  {
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    available: true,
    isbn: '9788573020913',
    category: 'Infantil',
  },
  {
    title: 'O Hobbit',
    author: 'J.R.R. Tolkien',
    available: true,
    isbn: '9788535922267',
    category: 'Ficção Fantástica',
  },
  {
    title: 'Os Irmãos Karamazov',
    author: 'Fiódor Dostoiévski',
    available: true,
    isbn: '9788535930003',
    category: 'Ficção',
  },
  { title: 'Madame Bovary', author: 'Gustave Flaubert', available: true, isbn: '9788535930188', category: 'Romance' },
  { title: 'O Alquimista', author: 'Paulo Coelho', available: true, isbn: '9788580571770', category: 'Ficção' },
  {
    title: 'A Sutil Arte de Ligar o Foda-se',
    author: 'Mark Manson',
    available: true,
    isbn: '9788551000148',
    category: 'Autoajuda',
  },
  {
    title: 'O Diário de Anne Frank',
    author: 'Anne Frank',
    available: true,
    isbn: '9788535940880',
    category: 'Memórias',
  },
];

const usersData = [
  { username: 'user1', password: 'senha123', name: 'Makawlly', email: 'mescaulee3@gmail.com' },
  { username: 'user2', password: 'senha123', name: 'Filipe', email: 'filipe.law@gmail.com' },
  { username: 'user3', password: 'senha123', name: 'Filipe 2', email: 'filipe.law45@gmail.com' },
];

async function main() {
  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash(user.password, 8);
    await prisma.users.upsert({
      where: { email: user.email },
      update: {
        username: user.username,
        password: hashedPassword,
        name: user.name,
      },
      create: {
        username: user.username,
        password: hashedPassword,
        name: user.name,
        email: user.email,
      },
    });
  }

  for (const book of booksData) {
    await prisma.books.upsert({
      where: { isbn: book.isbn },
      update: {
        title: book.title,
        author: book.author,
        available: book.available,
        category: book.category,
      },
      create: {
        title: book.title,
        author: book.author,
        available: book.available,
        isbn: book.isbn,
        category: book.category,
      },
    });
  }
}

main()
  .then(() => {
    console.log('Seed executada corretamente');
  })
  .catch((e) => {
    console.error('Erro ao popular o banco de dados:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
