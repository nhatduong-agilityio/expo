import { Href } from 'expo-router';

export const ROUTES = {
  // Auth routes
  LOGIN: '/(auth)/login',
  SIGNUP: '/(auth)/signup',

  // Tab routes
  HOME: '/(main)/(tabs)',
  EXPLORE: '/(main)/(tabs)/explore',
  BOOKMARK: '/(main)/(tabs)/bookmark',
  PROFILE: '/(main)/(tabs)/profile',

  // Modal routes
  SEARCH: '/(main)/search',
  SETTINGS: '/(main)/settings',
  EDIT_PROFILE: '/(main)/edit-profile',
  AUTHOR_PROFILE: (id: string): Href => `/(main)/author/${id}`,
  POST_DETAIL: (id: string): Href => `/(main)/post/${id}`,
  CREATE_POST: '/(main)/post/create',
} as const;
