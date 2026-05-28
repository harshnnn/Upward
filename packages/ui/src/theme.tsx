import { createContext, useContext } from 'react';

import { colors, radius, spacing, typography, elevation, motion, breakpoints } from '@upward/design-tokens';

export type ThemeMode = 'dark' | 'light';

export type Theme = {
  mode: ThemeMode;
  colors: typeof colors;
  radius: typeof radius;
  spacing: typeof spacing;
  typography: typeof typography;
  elevation: typeof elevation;
  motion: typeof motion;
  breakpoints: typeof breakpoints;
};

const defaultTheme: Theme = {
  mode: 'dark',
  colors,
  radius,
  spacing,
  typography,
  elevation,
  motion,
  breakpoints
};

const ThemeContext = createContext<Theme>(defaultTheme);

export const ThemeProvider = ThemeContext.Provider;

export const useTheme = (): Theme => {
  return useContext(ThemeContext);
};

export const theme = defaultTheme;