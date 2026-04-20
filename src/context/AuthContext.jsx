import { createContext, useContext, useState, useEffect } from "react";
import { getMe, logoutUser } from "../services/authServices";

const AuthContext = createContext();
  export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res.user);
      } catch (err) {
        if (err.response?.status === 401) {
          setUser(null); // normal
        } else {
          console.error("Auth error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser(); 
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,                
        setUser,
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);