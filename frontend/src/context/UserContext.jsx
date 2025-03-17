// UserContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for user state
const UserContext = createContext();

// Provider component to wrap your app with
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Default user is null (not logged in)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn,updateUser, login, logout,setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

// Export the context for use in other components
export const useUser = () => {
  return useContext(UserContext); // This is where you use useContext to get the context value
};
