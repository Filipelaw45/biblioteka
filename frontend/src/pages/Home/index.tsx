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
}

interface Reservation {
  userId: number;
  bookId: number;
}

export function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [search, setSearch] = useState<SearchType>('title');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const userId = authContext?.userId;

  const fetchBooks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/books?search=${query}&type=${search}`);
      const data: Book[] = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchReservations = async () => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:5000/users/${userId}/reservations`);
        const data = await response.json();
        setReservations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchReservations();
  }, [query, search, userId]);

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
    
    setIsLoading(true); 
    try {
      const response = await fetch(`http://localhost:5000/books/reserve/${bookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setBooks((prevBooks) =>
          prevBooks.map((book) => (book.id === bookId ? { ...book, available: false } : book))
        );
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error reserving book:', error);
    } finally {
      setIsLoading(false);
      fetchBooks();
      fetchReservations();
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

      {books.map((book, index) => {
        const isReservedByUser = reservations.some((reservation) => reservation.bookId === book.id);

        return (
          <Books key={book.id} isEven={index % 2 === 0}>
            <div>
              <p>Título: {book.title}</p>
              <p>Autor: {book.author}</p>
              <p>Categoria: {book.category}</p>
              <p>{book.available ? 'Disponível' : 'Já Reservado'}</p>
            </div>
            <button onClick={() => reserveBook(book.id)} disabled={isReservedByUser || isLoading}>
            {book.available
                ? 'Reservar'
                : isReservedByUser
                ? 'Você ja reservou esse livro'
                : 'Entrar na fila de reserva'}
            </button>
          </Books>
        );
      })}
    </Section>
  );
}