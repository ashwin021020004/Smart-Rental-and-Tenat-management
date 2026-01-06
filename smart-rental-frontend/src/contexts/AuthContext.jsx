import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Validate user data
        if (userData && userData.username && userData.role &&
            typeof userData.username === 'string' && userData.username.trim().length > 0 &&
            typeof userData.role === 'string' && userData.role.trim().length > 0) {
          setUser(userData);
        } else {
          // Invalid user data, clear it
          localStorage.removeItem('user');
        }
      } catch (error) {
        // Corrupted data, clear it
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const userData = response.data;
      // Ensure clean user data
      const cleanUserData = {
        username: userData.username?.trim(),
        role: userData.role?.trim()
      };
      setUser(cleanUserData);
      localStorage.setItem('user', JSON.stringify(cleanUserData));
      return { success: true, role: cleanUserData.role };
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage = typeof errorData === 'string' ? errorData : errorData?.message || 'Login failed';
      return { success: false, message: errorMessage };
    }
  };

  const register = async (username, password) => {
    try {
      const response = await api.post('/auth/register', { username, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage = typeof errorData === 'string' ? errorData : errorData?.message || 'Registration failed';
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
