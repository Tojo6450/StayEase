import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true); // Ensure loading is true when checking
    try {
      const { data } = await apiClient.get('/me');
      setUser(data.user);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setUser(null);
    } finally { // Use finally to ensure loading is set to false
        setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await apiClient.post('/login', { username, password });
      setUser(data.user);
      toast.success(data.message || 'Welcome back!');
      return data.user; // Return user data on success
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Invalid credentials.';
      toast.error(errorMessage);
      setUser(null); // Ensure user is null on failed login
      throw new Error(errorMessage); // Re-throw error for component handling
    }
  };

   const signup = async (username, email, password) => {
    try {
        const response = await apiClient.post('/signup', { username, email, password });
        if (response.data.success) {
            setUser(response.data.user); // Set user since backend logs them in
            toast.success(response.data.message || 'Signup successful! Welcome!');
            return response.data.user;
        } else {
             // This case might not be reached if backend throws errors
            throw new Error(response.data.message || 'Signup failed');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred during signup.';
        toast.error(errorMessage);
        setUser(null);
        throw new Error(errorMessage);
    }
   };


  const logout = async () => {
    try {
      await apiClient.get('/logout');
      setUser(null);
      toast.success('Logged out successfully.');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Logout failed');
      // Optionally handle specific logout errors
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup, // Added signup
    checkAuth,
    apiClient // Expose apiClient if needed elsewhere
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};