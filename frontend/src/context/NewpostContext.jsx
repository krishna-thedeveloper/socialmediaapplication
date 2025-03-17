import React, { createContext, useState, useContext } from 'react';

// Create the context with a capitalized name
const NewpostContext = createContext();

// Provider component to wrap your app with
export const NewpostProvider = ({ children }) => {
  const [newPostShow, setNewPostShow] = useState(false);

  return (
    <NewpostContext.Provider value={{ newPostShow, setNewPostShow }}>
      {children}
    </NewpostContext.Provider>
  );
};

// Export the context for use in other components
export const useNewpost = () => {
  return useContext(NewpostContext); // This is where you use useContext to get the context value
};