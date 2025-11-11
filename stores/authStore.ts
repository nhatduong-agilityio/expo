import { Profile } from '@/types';
import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  setSession: session =>
    set({ session, user: session?.user ?? null, isAuthenticated: !!session }),
  setProfile: profile => set({ profile }),
  setLoading: isLoading => set({ isLoading }),
  signOut: () =>
    set({ session: null, user: null, profile: null, isAuthenticated: false }),
}));
