import React, { useState, useEffect } from 'react';
// import { users } from '../../helpers/users';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // const [error, setError] = useState('');

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    await login(username, password);
  };

  return (
    <section>
      <h1>Biblioteka</h1>
      <h2>Login</h2>

      <form className="flex flex-col bg-blue-300" onSubmit={handleLogin}>
        <label htmlFor="username">Usuário:</label>
        <input
          id="username"
          name="username"
          autoComplete="off"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Senha:</label>
        <input
          id="password"
          name="password"
          autoComplete="off"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
        {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
      </form>
    </section>
  );
}
