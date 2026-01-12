import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth with stored token
    const isAuth = authAPI.initializeAuth();
    if (isAuth) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await authAPI.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      authAPI.logout();
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, fullName, role = 'citizen') => {
    try {
      const response = await authAPI.register({
        email,
        password,
        fullName,
        role
      });
      
      setUser(response.user);
      toast.success('Account created successfully!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Error creating account');
      console.error(error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await authAPI.login({
        email,
        password
      });
      
      setUser(response.user);
      toast.success('Successfully signed in!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Error signing in');
      console.error(error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      authAPI.logout();
      setUser(null);
      toast.success('Successfully signed out!');
    } catch (error) {
      toast.error('Error signing out');
      console.error(error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      await authAPI.updateProfile(profileData);
      if (user) {
        setUser({ ...user, ...profileData });
      }
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Error updating profile');
      console.error(error);
      throw error;
    }
  };

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    updateProfile,
    loading,
    isAuthenticated: !!user,
    role: user?.role || 'citizen'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
