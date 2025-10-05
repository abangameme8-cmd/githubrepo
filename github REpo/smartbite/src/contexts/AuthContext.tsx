import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/servesoft-api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'owner' | 'agent' | 'admin';
  phone?: string;
  town?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapServeSoftRole = (role: string): 'customer' | 'owner' | 'agent' | 'admin' => {
  const roleMap: Record<string, 'customer' | 'owner' | 'agent' | 'admin'> = {
    'customer': 'customer',
    'manager': 'owner',
    'driver': 'agent',
    'admin': 'admin'
  };
  return roleMap[role] || 'customer';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.verify()
      .then(response => {
        const mappedUser = {
          ...response.data.user,
          role: mapServeSoftRole(response.data.user.role)
        };
        setUser(mappedUser);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email, password });
      const mappedUser = {
        ...response.data.user,
        role: mapServeSoftRole(response.data.user.role)
      };

      setUser(mappedUser);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await authAPI.register(userData);
      const mappedUser = {
        ...response.data.user,
        role: mapServeSoftRole(response.data.user.role)
      };

      setUser(mappedUser);

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    authAPI.logout().catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}