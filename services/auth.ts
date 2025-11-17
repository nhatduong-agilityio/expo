import { PaginationParams, Profile, SignInData, SignUpData } from '@/types';
import { snakeToCamel } from '@/utils';
import { secureStorage } from './secureStorage';
import { supabase } from './supabase';

export const authService = {
  /**
   * Sign up a new user
   */
  signUp: async ({ email, password }: SignUpData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign in a user
   */
  signIn: async ({ email, password, rememberMe }: SignInData) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Store session securely
    if (data.session) {
      await secureStorage.setSessionData(JSON.stringify(data.session));

      if (data.session.access_token) {
        await secureStorage.setAccessToken(data.session.access_token);
      }

      if (data.session.refresh_token) {
        await secureStorage.setRefreshToken(data.session.refresh_token);
      }
    }

    // Store remember me preference securely
    if (rememberMe) {
      await secureStorage.setRememberMeEnabled(true);
      await secureStorage.setRememberMeEmail(email);
    } else {
      await secureStorage.removeRememberMeEnabled();
      await secureStorage.removeRememberMeEmail();
    }

    return data;
  },

  /**
   * Sign out a user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear all secure storage
    await secureStorage.clear();
  },

  /**
   * Get current session from secure storage
   */
  getSession: async () => {
    try {
      // Try to get from secure storage first
      const sessionData = await secureStorage.getSessionData();

      if (sessionData) {
        const session = JSON.parse(sessionData);

        // Validate session is not expired
        if (session.expires_at && session.expires_at * 1000 > Date.now()) {
          return session;
        }

        // Session expired, try to refresh
        const refreshToken = await secureStorage.getRefreshToken();
        if (refreshToken) {
          const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken,
          });

          if (!error && data.session) {
            // Store new session
            await secureStorage.setSessionData(JSON.stringify(data.session));
            await secureStorage.setAccessToken(data.session.access_token);
            await secureStorage.setRefreshToken(data.session.refresh_token);
            return data.session;
          }
        }
      }

      // Fallback to Supabase
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      // Store in secure storage for next time
      if (data.session) {
        await secureStorage.setSessionData(JSON.stringify(data.session));
        if (data.session.access_token) {
          await secureStorage.setAccessToken(data.session.access_token);
        }
        if (data.session.refresh_token) {
          await secureStorage.setRefreshToken(data.session.refresh_token);
        }
      }

      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },

  /**
   * Refresh the current session
   */
  refreshSession: async () => {
    try {
      const refreshToken = await secureStorage.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) throw error;

      // Store new session
      if (data.session) {
        await secureStorage.setSessionData(JSON.stringify(data.session));
        await secureStorage.setAccessToken(data.session.access_token);
        await secureStorage.setRefreshToken(data.session.refresh_token);
      }

      return data.session;
    } catch (error) {
      console.error('Refresh session error:', error);
      throw error;
    }
  },

  /**
   * Get user profile
   */
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId: string, updates: never): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

  /**
   * Search authors with pagination
   */
  searchAuthors: async (
    searchQuery: string,
    pagination: PaginationParams = { page: 1, limit: 10 },
  ) => {
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('followers_count', { ascending: false });

    // Apply search filter
    if (searchQuery) {
      query = query.or(
        `full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`,
      );
    }

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: snakeToCamel(data) || [],
      count: count || 0,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil((count || 0) / pagination.limit),
    };
  },

  /**
   * Get remembered email (from secure storage)
   */
  getRememberedEmail: async (): Promise<string | null> => {
    const isEnabled = await secureStorage.getRememberMeEnabled();
    if (isEnabled) {
      return await secureStorage.getRememberMeEmail();
    }
    return null;
  },

  /**
   * Check if remember me is enabled
   */
  isRememberMeEnabled: async (): Promise<boolean> => {
    return await secureStorage.getRememberMeEnabled();
  },
};
