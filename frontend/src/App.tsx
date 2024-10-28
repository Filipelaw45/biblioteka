import { AuthProvider } from './context/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router.tsx';
import Header from './components/Header/index.tsx';
import { ThemeProvider } from 'styled-components';
import light from './styles/themes/light';
import dark from './styles/themes/dark';
import GlobalStyle from './styles/global.ts';
import usePersistedState from './utils/usePersistedState.ts';
import React from 'react';

export function App() {
  const [theme, setTheme] = usePersistedState('theme', light);
  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light);
  };
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <GlobalStyle />
          <Header toggleTheme={toggleTheme} />
          <Router />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
