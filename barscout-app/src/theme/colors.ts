const palette = {
  amber: '#F59E0B',
  amberLight: '#FDE68A',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate500: '#64748B',
  slate300: '#CBD5E1',
  slate100: '#F1F5F9',
  white: '#FFFFFF',
  red500: '#EF4444',
  green500: '#22C55E',
} as const;

export const colors = {
  light: {
    primary: palette.amber,
    background: palette.white,
    surface: palette.slate100,
    text: palette.slate900,
    textMuted: palette.slate500,
    border: palette.slate300,
    error: palette.red500,
    success: palette.green500,
  },
  dark: {
    primary: palette.amber,
    background: palette.slate900,
    surface: palette.slate800,
    text: palette.white,
    textMuted: palette.slate500,
    border: palette.slate700,
    error: palette.red500,
    success: palette.green500,
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ThemeColors = { readonly [K in keyof typeof colors.light]: string };
