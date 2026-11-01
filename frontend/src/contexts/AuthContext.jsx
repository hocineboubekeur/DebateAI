import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('debateai_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    const token = res.data.token;
    if (token) {
      localStorage.setItem('debateai_token', token);
    }
    await fetchUser();
    return res.data;
  };

  const register = async (credentials) => {
    const res = await authAPI.register(credentials);
    const token = res.data.token;
    if (token) {
      localStorage.setItem('debateai_token', token);
    }
    await fetchUser();
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('debateai_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
