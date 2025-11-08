export const SCREENS = {
  // Auth screens
  AUTH: {
    LAYOUT: '(auth)',
    LOGIN: 'login',
    SIGNUP: 'signup',
  },

  // Tab screens
  TABS: {
    LAYOUT: '(tabs)',
    HOME: 'index',
    EXPLORE: 'explore',
  },

  // Modal screens
  SEARCH: 'search',
} as const;

export const TABS = {
  HOME: {
    NAME: 'index',
    TITLE: 'Home',
    ICON: 'home',
    ICON_OUTLINE: 'home-outline',
  },
  EXPLORE: {
    NAME: 'explore',
    TITLE: 'Explore',
    ICON: 'compass',
    ICON_OUTLINE: 'compass-outline',
  },
} as const;
