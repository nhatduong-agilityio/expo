import { breakpoints, darkTheme, lightTheme, sharedTheme } from '@/constants';
import { StyleSheet } from 'react-native-unistyles';

const themes = {
  light: {
    ...lightTheme,
    ...sharedTheme,
  },
  dark: {
    ...darkTheme,
    ...sharedTheme,
  },
} as const;

type AppBreakpoints = typeof breakpoints;
type AppThemes = {
  light: (typeof themes)['light'];
  dark: (typeof themes)['dark'];
};

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes,
  breakpoints,
  settings: {
    adaptiveThemes: true,
  },
});
