import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(prevState => !prevState);
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? {
      background: '#1E1E1E',
      text: '#FFFFFF',
      primary: '#007AFF',
      secondary: '#5AC8FA',
      card: '#2C2C2C',
    } : {
      background: '#F5F5F5',
      text: '#000000',
      primary: '#007AFF',
      secondary: '#5AC8FA',
      card: '#FFFFFF',
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};