import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { UserData, TOKEN_KEY, LoginInput, RegisterInput } from '../lib/types';
import { authService } from '../services/auth';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Check for existing session on mount
    const loadSession = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          const response = await authService.getMe();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token invalid or expired
            await SecureStore.deleteItemAsync(TOKEN_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to load session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const isAdminNotice = segments[0] === 'admin-notice';
    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';

    if (!isAuthenticated && !inAuthGroup && !isAdminNotice) {
      // Redirect to login if not authenticated and not in auth/admin-notice
      router.replace('/auth/login');
    } else if (isAuthenticated) {
      if (isAdmin && !isAdminNotice) {
        // Redirect admins to notice screen if they are not already there
        router.replace('/admin-notice');
      } else if (!isAdmin && (inAuthGroup || isAdminNotice)) {
        // Redirect students to main app if they are in auth or admin-notice
        router.replace('/(tabs)');
      }
    }
  }, [user, segments, isLoading]);

  const login = async (data: LoginInput) => {
    const response = await authService.login(data);
    if (response.success && response.data) {
      await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
      setUser(response.data.user);
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (data: RegisterInput) => {
    const response = await authService.register(data);
    if (response.success && response.data) {
      await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
      setUser(response.data.user);
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
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
