import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CVConnectStore } from "../store/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => CVConnectStore.getCurrentUser());

  useEffect(() => {
    CVConnectStore.seedIfEmpty();
    setUser(CVConnectStore.getCurrentUser());
  }, []);

  const refreshUser = useCallback(() => setUser(CVConnectStore.getCurrentUser()), []);

  const login = (email, password) => {
    const result = CVConnectStore.login(email, password);
    refreshUser();
    return result;
  };

  const logout = () => {
    CVConnectStore.logout();
    refreshUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
