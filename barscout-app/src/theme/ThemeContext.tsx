import { createContext, useCallback, useContext, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { colors } from './colors';
import type { ThemeColors } from './colors';

export type ColorMode = 'auto' | 'light' | 'dark';

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

  const scheme: 'light' | 'dark' = colorMode === 'auto' ? system : colorMode;
  const theme = colors[scheme];

  const handleSetColorMode = useCallback((mode: ColorMode) => {
    setColorMode(mode);
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
