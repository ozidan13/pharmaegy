'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '@prisma/client';

interface User {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, userType?: 'admin') => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch user profile on mount, relying on HttpOnly cookie
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/v1/auth/me', {
        headers: {
          // Cookie will be sent automatically by the browser
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        // No valid session or token is invalid
        setUser(null); // Ensure user is cleared if fetch fails
        setToken(null); // Clear token state as well
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null); // Ensure user is cleared on error
      setToken(null); // Clear token state as well
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, userType?: 'admin'): Promise<boolean> => {
    try {
      setIsLoading(true);
      const endpoint = userType === 'admin' ? '/api/v1/auth/admin/login' : '/api/v1/auth/login';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;
        const userData = data.user;

        setToken(authToken); // Set token in state (not localStorage)
        setUser(userData); // Set user directly from login response
        // No need to call fetchUserProfile again if login response includes user data
        // If it doesn't, then: await fetchUserProfile();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear frontend state regardless of backend response
      setUser(null);
      setToken(null);
      // localStorage.removeItem('token'); // No longer using localStorage
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};