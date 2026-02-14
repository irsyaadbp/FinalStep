import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../service/auth";
import { TOKEN_KEY, type UserData, type AuthResponse } from "@/types/shared";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: AuthResponse["data"]) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and fetch user
    const checkAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          // Verify token and get user details
          // For now, we'll optimistically set the user if we have some stored,
          // or we'd ideally hit a /me endpoint.
          // Assuming integration with /me endpoint later or now.
          const res = await authService.getMe();

          if (res.data) {

            setUser(res.data);
          }
        } catch (error) {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);



  const login = (data: AuthResponse["data"]) => {
    if (!data) return;
    setUser(data.user);
    localStorage.setItem(TOKEN_KEY, data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.data) {
        setUser(res.data);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
