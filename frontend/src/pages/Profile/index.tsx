import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CancelButton, ReservationItem, ReservationList, Section, Title } from './style';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
}

interface Reservation {
  id: number;
  book: Book;
  queueReservation: string[];
}

export function Profile() {
  const authContext = useContext(AuthContext);
  const userId = authContext?.userId;
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5000/users/${userId}/reservations`);
        if (response.ok) {
          const data = await response.json();
          setReservations(data);
        } else {
          console.error('Failed to fetch reservations');
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, [userId]);

  const refundBook = async (bookId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/books/refund/${bookId}`, {
        method: 'POST',
      });

      if (response.ok) {
        const updatedReservations = reservations.filter((res) => res.book.id !== bookId);
        setReservations(updatedReservations);
        console.log('Book returned successfully');
      } else {
        const result = await response.json();
        alert(result.message);
        console.error('Failed to refund book');
      }
    } catch (error) {
      console.error('Error refunding book:', error);
    }
  };

  return (
    <Section>
      <Title className="text-center text-2xl">Seu Perfil</Title>
      {reservations.length > 0 ? (
        <ReservationList>
          {reservations.map((reservation) => (
            <ReservationItem key={reservation.id} className="border p-4 mb-2">
              <h2>{reservation.book.title}</h2>
              <p>Autor: {reservation.book.author}</p>
              <p>Categoria: {reservation.book.category}</p>
              <p>Na fila: {reservation.queueReservation.length}</p>
              <p>Status: Reservado</p>
              <CancelButton
                onClick={() => refundBook(reservation.book.id)}
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded"
              >
                Devolver Livro
              </CancelButton>
            </ReservationItem>
          ))}
        </ReservationList>
      ) : (
        <p>Você ainda não reservou nenhum livro.</p>
      )}
    </Section>
  );
}