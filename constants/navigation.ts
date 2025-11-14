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
    BOOKMARK: 'bookmark',
    PROFILE: 'profile',
  },

  // Modal screens
  SEARCH: 'search',
  SETTINGS: 'settings',
  EDIT_PROFILE: 'edit-profile',
  AUTHOR_PROFILE: 'author/[id]',
  POST_DETAIL: 'post/[id]',
  CREATE_POST: 'post/create',
  STORYBOOK: '(storybook)/index',
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
  BOOKMARK: {
    NAME: 'bookmark',
    TITLE: 'Bookmark',
    ICON: 'bookmark',
    ICON_OUTLINE: 'bookmark-outline',
  },
  PROFILE: {
    NAME: 'profile',
    TITLE: 'Profile',
    ICON: 'person-circle',
    ICON_OUTLINE: 'person-circle-outline',
  },
} as const;
