import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  name: string | null;
  userId: number | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [name, setName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedUserId = localStorage.getItem('userId');
    if (storedName) setName(storedName);
    if (storedUserId) setUserId(Number(storedUserId));
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token, user } = await response.json(); // user agora contém { name, id }
        console.log('Response from server:', { token, user });

        localStorage.setItem('token', token);
        localStorage.setItem('name', user.name);
        localStorage.setItem('userId', user.id); // Armazena o userId como string

        setName(user.name);
        setUserId(user.id); // Atualiza o userId no estado
        setIsAuthenticated(true);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name'); // Limpar o nome do localStorage
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setName(null); // Limpar o nome ao sair
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, name, userId }}>{children}</AuthContext.Provider>
  );
};
