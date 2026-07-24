import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import api from "./api";
import type { User, Role } from "../types/api";

interface AuthContextValue {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, role: Role) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): User | null {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser());
  const [role, setRole] = useState<Role | null>(
    (localStorage.getItem("role") as Role | null) ?? null
  );

  const login = (user: User, token: string, role: Role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setRole(role);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // Le token est peut-être déjà expiré : on nettoie quand même côté client.
    }
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, role, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
