import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Section, Title, Form, Label, Input, Button } from './style';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
    <Section>
      <Title>Login</Title>

      <Form className="flex flex-col bg-blue-300" onSubmit={handleLogin}>
        <Label htmlFor="username">Usuário:</Label>
        <Input
          id="username"
          name="username"
          autoComplete="off"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Label htmlFor="password">Senha:</Label>
        <Input
          id="password"
          name="password"
          autoComplete="off"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Entrar</Button>
      </Form>
    </Section>
  );
}
