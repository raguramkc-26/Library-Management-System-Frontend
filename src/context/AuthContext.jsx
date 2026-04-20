import { createContext, useContext, useEffect, useState } from "react";
import instance from "../instances/instance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get("/auth/getMe");
        setUser(res?.data?.data || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    try {
      await instance.post("/auth/logout");
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);