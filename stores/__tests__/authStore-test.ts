import { mockAuthors } from '@/mocks';
import { useAuthStore } from '@/stores';
import { User } from '@supabase/supabase-js';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,
    });
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.isLoading).toBe(true);
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set user and update authentication status', () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' } as User;

    useAuthStore.getState().setUser(mockUser);
    const state = useAuthStore.getState();

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);

    useAuthStore.getState().setUser(null);
    const newState = useAuthStore.getState();
    expect(newState.user).toBeNull();
    expect(newState.isAuthenticated).toBe(false);
  });

  it('should set profile', () => {
    useAuthStore.getState().setProfile(mockAuthors[0]);
    const state = useAuthStore.getState();

    expect(state.profile).toEqual(mockAuthors[0]);
  });

  it('should set loading state', () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);

    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('should sign out', () => {
    // Set some state first
    const mockUser = { id: 'user-1' } as User;
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setProfile(mockAuthors[0]);

    // Sign out
    useAuthStore.getState().signOut();
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
