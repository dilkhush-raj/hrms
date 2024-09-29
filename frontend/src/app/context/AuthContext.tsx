"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

// Define the structure of your user object
interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Adjust fields based on your user model
}

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create the AuthContext with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST_URL,
  withCredentials: true,
});

// The AuthProvider component that wraps the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component is unmounted

    async function checkAuth() {
      try {
        const response = await api.get("/api/v1/auth/check-auth");
        if (response.data.success && isMounted) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    }

    if (!isAuthenticated) {
      checkAuth();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Logout function
  const logout = async () => {
    try {
      await api.post("/api/v1/auth/logout");
      setIsAuthenticated(false);
      setUser(null); // Clear user data on logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
