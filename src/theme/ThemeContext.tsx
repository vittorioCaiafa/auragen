import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';

const colorScheme = Appearance.getColorScheme();

export const ThemeContext = createContext<{
  isDark: boolean;
  colorScheme: ColorSchemeName;
  setScheme: (scheme: ColorSchemeName) => void;
}>({
  isDark: colorScheme === 'dark',
  colorScheme: colorScheme,
  setScheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const customSetScheme = (scheme: ColorSchemeName) => {
    setIsDark(scheme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ isDark, setScheme: customSetScheme, colorScheme: systemScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 