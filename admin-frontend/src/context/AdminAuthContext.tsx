import { createContext, useContext, useEffect, useState } from "react";
import { AdminAccount } from "../types";
import {
  clearStoredToken,
  fetchCurrentAdmin,
  getStoredToken,
  loginAdmin,
  registerAdmin,
  storeToken,
} from "../services/authApi";

type AdminAuthContextType = {
  admin: AdminAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<AdminAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetchCurrentAdmin()
      .then(setAdmin)
      .catch(() => clearStoredToken())
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { token, admin: account } = await loginAdmin(email, password);
    storeToken(token);
    setAdmin(account);
  };

  const register = async (name: string, email: string, password: string) => {
    const { token, admin: account } = await registerAdmin(name, email, password);
    storeToken(token);
    setAdmin(account);
  };

  const logout = () => {
    clearStoredToken();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, isAuthenticated: !!admin, isLoading, login, register, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
