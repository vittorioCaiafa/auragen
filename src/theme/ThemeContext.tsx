// src/theme/ThemeContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { lightTheme, darkTheme } from './themes';

type ThemeContextType = {
  isDark: boolean;
  colorScheme: ColorSchemeName;
  setScheme: (scheme: ColorSchemeName) => void;
  theme: typeof lightTheme;
};

const defaultScheme = Appearance.getColorScheme();

export const ThemeContext = createContext<ThemeContextType>({
  isDark: defaultScheme === 'dark',
  colorScheme: defaultScheme,
  setScheme: () => {},
  theme: defaultScheme === 'dark' ? darkTheme : lightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(defaultScheme);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });

    return () => subscription.remove(); // importante: limpiar
  }, []);

  const isDark = colorScheme === 'dark';

  const customSetScheme = (scheme: ColorSchemeName) => {
    setColorScheme(scheme);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colorScheme,
        setScheme: customSetScheme,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
