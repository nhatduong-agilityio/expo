import { Profile, SignInData, SignUpData } from '@/types';
import { snakeToCamel } from '@/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const REMEMBER_ME_KEY = '@news_app_remember_me';
const REMEMBERED_EMAIL_KEY = '@news_app_remembered_email';

export const authService = {
  signUp: async ({ email, password }: SignUpData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signIn: async ({ email, password, rememberMe }: SignInData) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Store remember me preference
    if (rememberMe) {
      await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');
      await AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear remember me data on sign out
    await AsyncStorage.removeItem(REMEMBER_ME_KEY);
    await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

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

  // Remember me helpers
  getRememberedEmail: async (): Promise<string | null> => {
    const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
    if (rememberMe === 'true') {
      return await AsyncStorage.getItem(REMEMBERED_EMAIL_KEY);
    }
    return null;
  },

  isRememberMeEnabled: async (): Promise<boolean> => {
    const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
    return rememberMe === 'true';
  },
};
