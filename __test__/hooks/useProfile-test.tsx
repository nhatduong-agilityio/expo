import { useUpdateProfile } from '@/hooks/useProfile';
import { mockAuthors as mockProfiles } from '@/mocks/data';
import { authService } from '@/services';
import { useAuthStore } from '@/stores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';

jest.mock('@/services');
jest.mock('@/stores');

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

describe('useProfile hooks', () => {
  const user = { id: '1' };
  const setProfile = jest.fn();

  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user,
      setProfile,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('useUpdateProfile', () => {
    it('should update a user profile', async () => {
      const updatedProfile = { ...mockProfiles[0], username: 'updated' };
      const input = { username: 'updated' };
      (authService.updateProfile as jest.Mock).mockResolvedValue(
        updatedProfile,
      );
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useUpdateProfile(), { wrapper });

      result.current.mutate(input);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authService.updateProfile).toHaveBeenCalledWith(user.id, input);
      expect(setProfile).toHaveBeenCalledWith(updatedProfile);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['profile', user.id],
      });
    });
  });
});
