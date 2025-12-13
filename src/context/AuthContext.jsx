import { createContext, useState, useEffect } from "react";
import { getStoredUser, getStoredToken, setStoredUser, setStoredToken, clearStoredAuth } from "../utils/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from storage
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();
    
    setToken(storedToken);
    setUser(storedUser);
    setLoading(false);
  }, []);

  const login = (authData) => {
    setStoredToken(authData.token);
    setStoredUser(authData.user);
    
    setToken(authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!(token && user);
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      loading,
      login, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
