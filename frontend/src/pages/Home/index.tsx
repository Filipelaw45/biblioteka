import React from 'react';
import { useState } from 'react';
import { books as initialBooks } from '../../helpers/books';

type SearchType = 'title' | 'author' | 'category';

export function Home() {
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState<SearchType>('title');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bookSearched = e.target.value.toLowerCase();
    if (bookSearched === '') {
      setBooks(initialBooks);
    } else {
      const newBooks = initialBooks.filter((book) => book[search].toLowerCase().includes(bookSearched));
      setBooks(newBooks);
    }
  };

  const handleTypeSearch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeSearch = e.target.value as SearchType;
    setSearch(typeSearch);
    setBooks(initialBooks);
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
        </select>
      </div>

      {books.map((e, i) => (
        <div key={i} className={i % 2 === 0 ? 'bg-slate-300' : 'bg-blue-300'}>
          <p>{e.title}</p>
          <p>{e.author}</p>
          <p>{e.category}</p>
        </div>
      ))}
    </section>
  );
}
