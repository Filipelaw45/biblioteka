// Home.test.tsx
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { userEvent } from '@testing-library/user-event';
import { Home } from '.';

jest.mock('../../helpers/books', () => ({
  books: [
    { title: 'Livro 1', author: 'Autor 1', category: 'Categoria 1' },
    { title: 'Livro 2', author: 'Autor 2', category: 'Categoria 2' },
    { title: 'Outro Livro', author: 'Autor 3', category: 'Categoria 1' },
  ],
}));

describe('Home Component', () => {
  test('renders the component and displays initial books', () => {
    const { getByText } = render(<Home />);

    expect(getByText('Livro 1')).toBeInTheDocument();
    expect(getByText('Livro 2')).toBeInTheDocument();
    expect(getByText('Outro Livro')).toBeInTheDocument();
  });

  test('search by title', async () => {
    const { getByText, getByPlaceholderText, getByRole, debug } = render(<Home />);

    const inputElement = getByPlaceholderText('Insira o nome do livro');
    const selectElement = getByRole('combobox');

    debug();

    await userEvent.selectOptions(selectElement, 'title');
    await userEvent.type(inputElement, 'Livro 1');

    debug();

    expect(getByText('Livro 1')).toBeInTheDocument();
    // expect(getByText('Livro 2')).not.toBeInTheDocument();
    
  });
});
