import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '.';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import light from '../../styles/themes/light';

describe('Header', () => {
  const theme = light;
  const toggleTheme = jest.fn();

  it('should render Header correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <Header toggleTheme={toggleTheme} />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    );

    expect(screen.getByText('BIBLIOTEKA')).toBeInTheDocument();
  });
});
