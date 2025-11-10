export const ROUTES = {
  // Auth routes
  LOGIN: '/(auth)/login',
  SIGNUP: '/(auth)/signup',

  // Tab routes
  HOME: '/(tabs)',
  EXPLORE: '/(tabs)/explore',
  BOOKMARK: '/(tabs)/bookmark',
  PROFILE: '/(tabs)/profile',

  // Modal routes
  SEARCH: '/search',
  SETTINGS: '/settings',
  EDIT_PROFILE: '/edit-profile',
} as const;
