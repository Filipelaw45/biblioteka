import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.users.createMany({
    data: [
      {
        username: 'user1',
        password_hash: 'senha123',
      },
      {
        username: 'user2',
        password_hash: 'senha123',
      },
    ],
  });

  await prisma.books.createMany({
    data: [
      {
        title: 'Livro 1',
        author: 'Autor 1',
        available: true,
        isbn: 111222333,
      },
      {
        title: 'Livro 2',
        author: 'Autor 2',
        available: true,
        isbn: 222333444,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error('Erro ao popular o banco de dados:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
