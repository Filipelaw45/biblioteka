import React, { useState, useEffect } from 'react';

type SearchType = 'title' | 'author' | 'category' | 'isbn';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: boolean;
  created_at: string;
}

export function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState<SearchType>('title');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/books?search=${query}&type=${search}`);
        const data: Book[] = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [query, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleTypeSearch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearch(e.target.value as SearchType);
  };

  const reserveBook = async (bookId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/books/reserve/${bookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedBooks = books.map((book) =>
          book.id === bookId ? { ...book, available: false } : book
        );
        setBooks(updatedBooks);
      } else {
        console.error('Failed to reserve book');
      }
    } catch (error) {
      console.error('Error reserving book:', error);
    }
  };

  return (
    <section>
      <h1 className="text-center text-2xl">Biblioteka</h1>
      <div className="flex">
        <input className="border p-3" type="text" onChange={handleSearch} placeholder="Insira o nome do livro" />
        <select name="typeSearch" onChange={handleTypeSearch}>
          <option value="title">Título</option>
          <option value="author">Autor</option>
          <option value="category">Categoria</option>
          <option value="isbn">ISBN</option>
        </select>
      </div>

      {books.map((book) => (
        <div key={book.id}>
          <div>
            <p>{book.title}</p>
            <p>{book.author}</p>
            <p>{book.category}</p>
            <p>
              {book.available ? 'Disponível' : 'Já Reservado'}
            </p>
          </div>
          {book.available && (
            <button onClick={() => reserveBook(book.id)}>
              Reservar
            </button>
          )}
        </div>
      ))}
    </section>
  );
}