import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded.sub); 
    }
  }, []);

  const login = (token) => {
    addToken(token);
    const decoded = jwtDecode(token);
    setUser(decoded.sub);
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  const getToken = () => localStorage.getItem('token');

  const addToken = (token) => localStorage.setItem('token', token);

  const removeToken = () => localStorage.removeItem('token');

  const authContextValue = {
    user,
    login,
    logout,
    getToken,
    addToken,
    removeToken
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };