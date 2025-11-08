import { palettes } from './palettes';

const { blue, red, green, yellow, grey, neutral } = palettes;

export const lightTheme = {
  colors: {
    // Brand
    primary: blue.blue50,
    primaryHover: blue.blue60,
    primaryPressed: blue.blue70,
    primaryLight: blue.blue10,

    // Status colors
    error: red.red50,
    errorHover: red.red60,
    errorPressed: red.red70,
    errorLight: red.red10,
    errorDark: red.red60,

    success: green.green50,
    successHover: green.green60,
    successPressed: green.green70,
    successLight: green.green10,
    successDark: green.green60,

    warning: yellow.yellow50,
    warningHover: yellow.yellow60,
    warningPressed: yellow.yellow70,
    warningLight: yellow.yellow10,
    warningDark: yellow.yellow60,

    // Backgrounds
    background: neutral.white,
    backgroundSecondary: grey.grey05,
    backgroundTertiary: grey.grey10,
    surface: neutral.white,
    surfaceHover: grey.grey05,
    surfacePressed: grey.grey10,
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Text
    textPrimary: neutral.black,
    textSecondary: grey.grey70,
    textTertiary: grey.grey60,
    textDisabled: grey.grey40,
    textPlaceholder: grey.grey40,
    textOnPrimary: neutral.white,
    textLink: blue.blue50,

    // Borders
    border: grey.grey15,
    borderHover: grey.grey20,
    borderFocus: blue.blue50,
    borderError: red.red50,
    divider: grey.grey15,

    // Interactive elements
    buttonPrimary: blue.blue50,
    buttonPrimaryHover: blue.blue60,
    buttonPrimaryPressed: blue.blue70,
    buttonSecondary: grey.grey15,
    buttonSecondaryHover: grey.grey20,
    buttonSecondaryPressed: grey.grey30,
    buttonDisabled: grey.grey15,
    buttonTextDisabled: grey.grey40,

    // Input states
    inputBackground: neutral.white,
    inputBorder: grey.grey70,
    inputBorderHover: grey.grey20,
    inputBorderFocus: blue.blue50,
    inputBorderError: red.red50,

    // Icons
    iconPrimary: neutral.black,
    iconSecondary: grey.grey60,
    iconTertiary: grey.grey40,
    iconDisabled: grey.grey30,
    iconOnPrimary: neutral.white,

    // Checkbox
    checkboxBorder: grey.grey60,
    checkboxChecked: grey.grey60,

    // Tabs
    tabActive: neutral.black,
    tabInactive: grey.grey60,
  },
} as const;

export const darkTheme = {
  colors: {
    // Brand
    primary: blue.blue50,
    primaryHover: blue.blue40,
    primaryPressed: blue.blue30,
    primaryLight: blue.blue90,

    // Status colors
    error: red.red40,
    errorHover: red.red30,
    errorPressed: red.red20,
    errorLight: red.red10,
    errorDark: red.red40,

    success: green.green40,
    successHover: green.green30,
    successPressed: green.green20,
    successLight: green.green90,
    successDark: green.green60,

    warning: yellow.yellow40,
    warningHover: yellow.yellow30,
    warningPressed: yellow.yellow20,
    warningLight: yellow.yellow90,
    warningDark: yellow.yellow60,

    // Backgrounds
    background: grey.grey95,
    backgroundSecondary: grey.grey90,
    backgroundTertiary: grey.grey80,
    surface: grey.grey80,
    surfaceHover: grey.grey70,
    surfacePressed: grey.grey60,
    overlay: 'rgba(0, 0, 0, 0.7)',

    // Text
    textPrimary: grey.grey20,
    textSecondary: grey.grey40,
    textTertiary: grey.grey50,
    textDisabled: grey.grey60,
    textPlaceholder: grey.grey50,
    textOnPrimary: neutral.white,
    textLink: blue.blue40,

    // Borders
    border: grey.grey80,
    borderHover: grey.grey70,
    borderFocus: blue.blue50,
    borderError: red.red40,
    divider: grey.grey80,

    // Interactive elements
    buttonPrimary: blue.blue50,
    buttonPrimaryHover: blue.blue40,
    buttonPrimaryPressed: blue.blue30,
    buttonSecondary: grey.grey80,
    buttonSecondaryHover: grey.grey70,
    buttonSecondaryPressed: grey.grey60,
    buttonDisabled: grey.grey15,
    buttonTextDisabled: grey.grey60,

    // Input states
    inputBackground: grey.grey80,
    inputBorder: grey.grey70,
    inputBorderHover: grey.grey60,
    inputBorderFocus: blue.blue50,
    inputBorderError: red.red40,

    // Icons
    iconPrimary: grey.grey20,
    iconSecondary: grey.grey40,
    iconTertiary: grey.grey50,
    iconDisabled: grey.grey60,
    iconOnPrimary: neutral.white,

    // Controls
    checkboxBorder: grey.grey60,
    checkboxChecked: grey.grey60,

    // Tabs
    tabActive: neutral.white,
    tabInactive: grey.grey40,
  },
} as const;

export const sharedTheme = {
  // Typography
  fontFamily: {
    regular: 'Poppins-Regular',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },

  fontWeight: {
    regular: '400',
    semiBold: '600',
    bold: '700',
  } as const,

  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 48,
  },

  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 40,
    '4xl': 56,
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
    '4xl': 64,
  },

  // Border radius
  borderRadius: {
    none: 0,
    xxs: 2,
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },

  // Shadows
  shadow: {
    none: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  // Z-index
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },

  // Transitions
  transition: {
    fast: 150,
    normal: 250,
    slow: 350,
  },

  // Opacity
  opacity: {
    disabled: 0.5,
    hover: 0.8,
    pressed: 0.6,
  },
} as const;

export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  '2xl': 1400,
} as const;
