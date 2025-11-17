import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth';
import { secureStorage } from '@/services/secureStorage';
import { useAuthStore } from '@/stores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

jest.mock('@/services/auth');
jest.mock('@/services/secureStorage');
jest.mock('@/stores');
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useAuth', () => {
  const setUser = jest.fn();
  const setProfile = jest.fn();
  const replace = jest.fn();
  const clear = jest.fn();

  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      setUser,
      setProfile,
    });
    (useRouter as jest.Mock).mockReturnValue({ replace });
    queryClient.setQueryData = jest.fn();
    queryClient.clear = clear;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call signUp and redirect on success', async () => {
    const signUpData = {
      email: 'test@test.com',
      password: 'password',
      rememberMe: true,
    };
    (authService.signUp as jest.Mock).mockResolvedValue({ user: { id: '1' } });

    const { result } = renderHook(() => useAuth(), { wrapper });
    result.current.signUp(signUpData);

    await waitFor(() => {
      expect(authService.signUp).toHaveBeenCalledWith(signUpData);
      expect(secureStorage.setRememberMeEnabled).toHaveBeenCalledWith(true);
      expect(secureStorage.setRememberMeEmail).toHaveBeenCalledWith(
        signUpData.email,
      );
      expect(replace).toHaveBeenCalledWith(ROUTES.LOGIN);
    });
  });

  it('should call signIn, set user and profile, and redirect on success', async () => {
    const signInData = { email: 'test@test.com', password: 'password' };
    const session = { user: { id: '1' } };
    const profile = { id: '1', username: 'test' };
    (authService.signIn as jest.Mock).mockResolvedValue({ session });
    (authService.getProfile as jest.Mock).mockResolvedValue(profile);

    const { result } = renderHook(() => useAuth(), { wrapper });
    result.current.signIn(signInData);

    await waitFor(() => {
      expect(authService.signIn).toHaveBeenCalledWith(signInData);
      expect(setUser).toHaveBeenCalledWith(session.user);
      expect(authService.getProfile).toHaveBeenCalledWith('1');
      expect(setProfile).toHaveBeenCalledWith(profile);
      expect(replace).toHaveBeenCalledWith(ROUTES.HOME);
    });
  });

  it('should call signOut, clear query cache, and reset auth store', async () => {
    (authService.signOut as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });
    result.current.signOut();

    await waitFor(() => {
      expect(authService.signOut).toHaveBeenCalled();
      expect(clear).toHaveBeenCalled();
      expect(setUser).toHaveBeenCalledWith(null);
      expect(setProfile).toHaveBeenCalledWith(null);
    });
  });
});
