import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  name: string | null;
  userId: number | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storedData = localStorage.getItem('userData');
  const { name, userId } = storedData ? JSON.parse(storedData) : { name: null, userId: null };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [userName, setUserName] = useState<string | null>(name);
  const [userIdState, setUserIdState] = useState<number | null>(userId);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token, user } = await response.json();
        console.log('Response from server:', { token, user });

        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify({ name: user.name, userId: user.id }));

        setUserName(user.name);
        setUserIdState(user.id);
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
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserName(null);
    setUserIdState(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, name: userName, userId: userIdState }}>
      {children}
    </AuthContext.Provider>
  );
};