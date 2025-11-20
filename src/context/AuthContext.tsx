import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for stored auth token
    const storedUser = localStorage.getItem('plaza_vea_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    const mockUsers = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@plazavea.com',
        role: 'admin' as const,
        name: 'Administrador Sistema',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        username: 'manager',
        email: 'manager@plazavea.com',
        role: 'manager' as const,
        name: 'Gerente Inventario',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        username: 'employee',
        email: 'employee@plazavea.com',
        role: 'employee' as const,
        name: 'Empleado Almacén',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    const foundUser = mockUsers.find(u => u.username === username && password === 'password');
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('plaza_vea_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('plaza_vea_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};