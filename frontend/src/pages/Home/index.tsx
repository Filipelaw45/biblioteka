import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Books, Section, Search } from './style';

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
  const authContext = useContext(AuthContext);

  const userId = authContext?.userId;

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
    if (!userId) {
      alert('User not logged in');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/books/reserve/${bookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.message.includes('fila')) {
          alert(result.message);
        } else {
          const updatedBooks = books.map((book) => (book.id === bookId ? { ...book, available: false } : book));
          setBooks(updatedBooks);
          alert(result.message);
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error reserving book:', error);
    }
  };

  return (
    <Section>
      <Search>
        <input type="text" onChange={handleSearch} placeholder={`Digite para buscar`} />
        <select name="typeSearch" onChange={handleTypeSearch}>
          <option value="title">Título</option>
          <option value="author">Autor</option>
          <option value="category">Categoria</option>
          <option value="isbn">ISBN</option>
        </select>
      </Search>

      {books.map((book, index) => (
        <Books key={book.id} isEven={index % 2 === 0}>
          <div>
            <p>Título: {book.title}</p>
            <p>Autor: {book.author}</p>
            <p>Categoria: {book.category}</p>
            <p>{book.available ? 'Disponível' : 'Já Reservado'}</p>
          </div>
          <button onClick={() => reserveBook(book.id)}>Reservar</button>
        </Books>
      ))}
    </Section>
  );
}
