import React, { useContext } from 'react';
import Switch from 'react-switch';
import { ThemeContext } from 'styled-components';
import { Button, Container, Logo, Profile } from './styles';
import { shade } from 'polished';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

interface Props {
  toggleTheme(): void;
}

const Header: React.FC<Props> = ({ toggleTheme }) => {
  const { colors, title } = useContext(ThemeContext)!;
  const { name, isAuthenticated, logout } = useAuth();

  return (
    <Container>
      <div>
        <Link to="/" style={{textDecoration: 'none'}}>
          <Logo style={{ fontWeight: 'bold' }}>BIBLIOTEKA</Logo>
        </Link>
      </div>

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

      <div>
        {isAuthenticated && (
          <Profile>
            <div>Bem-vindo, {name}!</div>
            <Link to="/">
              <Button>Inicio</Button>
            </Link>
            <Link to="/profile">
              <Button>Perfil</Button>
            </Link>
            <Button onClick={logout}>Sair</Button>
          </Profile>
        )}
      </div>
    </Container>
  );
};

export default Header;
