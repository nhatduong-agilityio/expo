import {
  BookmarkFilled,
  BookmarkOutline,
  CompassFilled,
  CompassOutline,
  HomeFilled,
  HomeOutline,
  ProfileFilled,
  ProfileOutline,
} from '@/components/icons';

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
    ICON: HomeFilled,
    ICON_OUTLINE: HomeOutline,
  },
  EXPLORE: {
    NAME: 'explore',
    TITLE: 'Explore',
    ICON: CompassFilled,
    ICON_OUTLINE: CompassOutline,
  },
  BOOKMARK: {
    NAME: 'bookmark',
    TITLE: 'Bookmark',
    ICON: BookmarkFilled,
    ICON_OUTLINE: BookmarkOutline,
  },
  PROFILE: {
    NAME: 'profile',
    TITLE: 'Profile',
    ICON: ProfileFilled,
    ICON_OUTLINE: ProfileOutline,
  },
} as const;
