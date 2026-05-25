import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from './colors';
import type { ThemeColors } from './colors';

export type ColorMode = 'auto' | 'light' | 'dark';

const COLOR_MODE_KEY = '@barscout/colorMode';

type ThemeContextValue = {
  theme: ThemeColors;
  scheme: 'light' | 'dark';
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useSystemColorScheme() ?? 'light';
  const [colorMode, setColorMode] = useState<ColorMode>('auto');

  useEffect(() => {
    AsyncStorage.getItem(COLOR_MODE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        setColorMode(saved);
      }
    });
  }, []);

  const scheme: 'light' | 'dark' = colorMode === 'auto' ? system : colorMode;
  const theme = colors[scheme];

  const handleSetColorMode = useCallback((mode: ColorMode) => {
    setColorMode(mode);
    AsyncStorage.setItem(COLOR_MODE_KEY, mode);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, scheme, colorMode, setColorMode: handleSetColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
