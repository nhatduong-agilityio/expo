import { Href } from 'expo-router';

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
  AUTHOR_PROFILE: (id: string): Href => `/author/${id}`,
  POST_DETAIL: (id: string): Href => `/post/${id}`,
  CREATE_POST: '/post/create',
} as const;
