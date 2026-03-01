import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, getErrorMessage } from '../lib/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(token));

  const persistToken = (nextToken: string | null) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken(nextToken);
  };

  const refreshMe = async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setUser(null);
      return;
    }

    try {
      const response = await api.get<{ success: boolean; user: User }>('/auth/me');
      setUser(response.data.user);
    } catch {
      persistToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshMe();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{ success: boolean; token: string; user: User }>('/auth/login', {
        email,
        password,
      });
      persistToken(response.data.token);
      setUser(response.data.user);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const response = await api.post<{ success: boolean; token: string; user: User }>('/auth/google', {
        credential,
      });
      persistToken(response.data.token);
      setUser(response.data.user);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const response = await api.post<{ success: boolean; token: string; user: User }>('/auth/register', {
        name,
        email,
        password,
        phone,
      });
      persistToken(response.data.token);
      setUser(response.data.user);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = () => {
    persistToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === 'admin',
      login,
      loginWithGoogle,
      register,
      logout,
      refreshMe,
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
