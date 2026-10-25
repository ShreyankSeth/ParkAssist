/**
 * @file AuthContext.jsx
 * @description React Context API architecture for Global Authentication State.
 * Demonstrates Global vs Local state management by centralizing user authentication,
 * registered accounts, session persistence, and login/logout methods across the app.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Auth Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Global authenticated user state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('parkassist_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Registered accounts stored in localStorage
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    try {
      const raw = localStorage.getItem('parkassist_registered_accounts');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Sync current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('parkassist_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('parkassist_user');
    }
  }, [currentUser]);

  // Global Sign-Up action
  const registerUser = (accountData, rememberPassword = true) => {
    const updatedAccounts = [...registeredAccounts, accountData];
    setRegisteredAccounts(updatedAccounts);
    localStorage.setItem('parkassist_registered_accounts', JSON.stringify(updatedAccounts));

    if (rememberPassword) {
      localStorage.setItem('parkassist_saved_remembered_account', JSON.stringify(accountData));
    }

    setCurrentUser(accountData);
    return { success: true };
  };

  // Global Login action with strict authentication matching
  const loginUser = (name, carNo, password) => {
    const searchName = name.trim().toLowerCase();
    const searchCar = carNo.trim().replace(/\s+/g, '').toUpperCase();

    const matched = registeredAccounts.find(acc =>
      acc.name.toLowerCase() === searchName &&
      acc.carNo.replace(/\s+/g, '').toUpperCase() === searchCar &&
      acc.password === password
    );

    if (matched) {
      setCurrentUser(matched);
      return { success: true, user: matched };
    }

    return {
      success: false,
      message: 'Invalid Credentials: The Name or Password is not valid.'
    };
  };

  // Global Logout action
  const logoutUser = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    setCurrentUser,
    isAuthenticated: !!currentUser,
    registeredAccounts,
    registerUser,
    loginUser,
    logoutUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for consuming AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
