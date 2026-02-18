'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';

// Import your Amplify configuration
import '../../src/amplifyconfiguration.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAdmin(currentUser.username === 'admin');
      }
    } catch (error) {
      console.log('No authenticated user');
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = `https://us-east-1hrsgomunl.auth.us-east-1.amazoncognito.com/login/continue?client_id=6nd3tt2a6m98pca4j1jnops45u&redirect_uri=https%3A%2F%2Fbinsentry-dashboard-pj7ajj85n-mais-projects-6a3ce250.vercel.app%2Fdashboard&response_type=code&scope=email+openid+phone`;
  };

  const logout = () => {
    window.location.href = `https://us-east-1hrsgomunl.auth.us-east-1.amazoncognito.com/logout?client_id=6nd3tt2a6m98pca4j1jnops45u&logout_uri=http://localhost:3000`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}