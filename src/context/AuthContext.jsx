import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Set backend base URL
let apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (apiBaseURL && !apiBaseURL.endsWith('/api')) {
  apiBaseURL = apiBaseURL.replace(/\/$/, '') + '/api';
}
axios.defaults.baseURL = apiBaseURL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        unverified: error.response?.data?.unverified,
        email: error.response?.data?.email,
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await axios.post('/auth/register', { name, email, password, phone });
      return { success: true, message: response.data.message, email: response.data.email };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await axios.post('/auth/verify-otp', { email, otp });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (name, phone, password) => {
    try {
      const response = await axios.put('/auth/profile', { name, phone, password });
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true, message: 'Profile updated successfully' };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
      };
    }
  };

  const addAddress = async (address) => {
    try {
      const response = await axios.post('/auth/address', address);
      if (response.data.success) {
        setUser(prev => ({ ...prev, addresses: response.data.addresses }));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add address',
      };
    }
  };

  const deleteAddress = async (id) => {
    try {
      const response = await axios.delete(`/auth/address/${id}`);
      if (response.data.success) {
        setUser(prev => ({ ...prev, addresses: response.data.addresses }));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete address',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        verifyOTP,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
