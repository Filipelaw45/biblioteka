import React, { useContext } from 'react';
import Switch from 'react-switch';
import { ThemeContext } from 'styled-components';
import { Container } from './styles';
import { shade } from 'polished';
import { useAuth } from '../../hooks/useAuth'; // Hook para o AuthContext
import { Link } from 'react-router-dom'; // Importando Link

interface Props {
  toggleTheme(): void;
}

const Header: React.FC<Props> = ({ toggleTheme }) => {
  const { colors, title } = useContext(ThemeContext)!;
  const { name, isAuthenticated, logout } = useAuth();

  return (
    <Container>
      <Link to="/">
        <p style={{ fontWeight: 'bold' }}>BIBLIOTEKA</p>{' '}
      </Link>

      <div>{isAuthenticated ? `Bem-vindo, ${name}!` : 'Usuário não logado.'}</div>
      {isAuthenticated && (
        <Link to="/profile">
          <button style={{ marginRight: '10px' }}>Perfil</button>
        </Link>
      )}
      <button onClick={logout}>SAIR</button>

      <Switch
        onChange={toggleTheme}
        checked={title === 'dark'}
        checkedIcon={false}
        uncheckedIcon={false}
        height={10}
        width={40}
        handleDiameter={20}
        offColor={shade(0.3, colors.primary)}
        onColor={colors.secondary}
      ></Switch>
    </Container>
  );
};

export default Header;
