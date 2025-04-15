import React, { ReactNode, useEffect, useState } from 'react';
import { login } from '../services/api';
import { User } from '../types';
import { AuthContext } from '../context/AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    }, []);
  
    const loginUser = async (email: string, password: string): Promise<void> => {
        const response = await login(email, password);
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
    };
  
    const logout = (): void => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ user, login: loginUser, logout, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };