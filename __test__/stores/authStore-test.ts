import { mockAuthors } from '@/mocks';
import { useAuthStore } from '@/stores';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      session: null,
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
    });
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set session', () => {
    const mockSession = {
      access_token: 'token',
      user: { id: 'user-1', email: 'test@example.com' },
    } as any;

    useAuthStore.getState().setSession(mockSession);
    const state = useAuthStore.getState();

    expect(state.session).toEqual(mockSession);
    expect(state.user).toEqual(mockSession.user);
    expect(state.isAuthenticated).toBe(true);
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
    useAuthStore.getState().setSession({
      access_token: 'token',
      user: { id: 'user-1' },
    } as any);
    useAuthStore.getState().setProfile(mockAuthors[0]);

    // Sign out
    useAuthStore.getState().signOut();
    const state = useAuthStore.getState();

    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
