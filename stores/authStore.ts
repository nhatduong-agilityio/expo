import { Profile } from '@/types';
import { User } from '@supabase/supabase-js';
import { create } from 'zustand';

/**
 * Auth store - Only stores non-sensitive data
 * Sensitive data (tokens, session) stored in SecureStore
 */
interface AuthState {
  // Non-sensitive user data
  user: User | null;
  profile: Profile | null;

  // UI state
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (authenticated: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: user => set({ user, isAuthenticated: !!user }),
  setProfile: profile => set({ profile }),
  setLoading: isLoading => set({ isLoading }),
  setAuthenticated: isAuthenticated => set({ isAuthenticated }),

  signOut: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
    }),
}));
