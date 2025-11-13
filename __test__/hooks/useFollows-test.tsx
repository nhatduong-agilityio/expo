import {
  useFollowers,
  useFollowing,
  useIsFollowing,
  useToggleFollow,
} from '@/hooks/useFollows';
import { mockAuthors as mockProfiles } from '@/mocks/data';
import { followService } from '@/services';
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

describe('useFollows hooks', () => {
  const user = { id: '1' };
  const setProfile = jest.fn();
  const profile = { ...mockProfiles[0], followingCount: 1 };

  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user,
      profile,
      setProfile,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('useIsFollowing', () => {
    it('should check if a user is following another user', async () => {
      (followService.isFollowing as jest.Mock).mockResolvedValue(true);
      const followingId = '2';

      const { result } = renderHook(() => useIsFollowing(followingId), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(followService.isFollowing).toHaveBeenCalledWith(
        user.id,
        followingId,
      );
      expect(result.current.data).toBe(true);
    });
  });

  describe('useFollowers', () => {
    it("should fetch a user's followers", async () => {
      (followService.getFollowers as jest.Mock).mockResolvedValue(mockProfiles);
      const userId = '2';

      const { result } = renderHook(() => useFollowers(userId), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(followService.getFollowers).toHaveBeenCalledWith(userId);
      expect(result.current.data).toEqual(mockProfiles);
    });
  });

  describe('useFollowing', () => {
    it('should fetch the list of users a user is following', async () => {
      (followService.getFollowing as jest.Mock).mockResolvedValue(mockProfiles);
      const userId = '1';

      const { result } = renderHook(() => useFollowing(userId), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(followService.getFollowing).toHaveBeenCalledWith(userId);
      expect(result.current.data).toEqual(mockProfiles);
    });
  });

  describe('useToggleFollow', () => {
    it('should toggle a follow and perform optimistic update', async () => {
      const followingId = '2';
      (followService.toggleFollow as jest.Mock).mockResolvedValue(undefined);
      queryClient.setQueryData(['follows', 'check', followingId], false);
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useToggleFollow(), { wrapper });

      result.current.mutate(followingId);

      await waitFor(() => {
        // Check optimistic update
        expect(
          queryClient.getQueryData(['follows', 'check', followingId]),
        ).toBe(true);
        expect(setProfile).toHaveBeenCalledWith({
          ...profile,
          followingCount: 2,
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(followService.toggleFollow).toHaveBeenCalledWith(
        user.id,
        followingId,
      );
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['follows', 'check', followingId],
      });
    });

    it('should handle network error when toggling follow', async () => {
      const followingId = '2';
      const networkError = new Error('Network request failed');
      (followService.toggleFollow as jest.Mock).mockResolvedValue(
        Promise.reject(networkError),
      );

      queryClient.setQueryData(['follows', 'check', followingId], true);

      const { result } = renderHook(() => useToggleFollow(), { wrapper });

      result.current.mutate(followingId);

      await waitFor(() => expect(result.current.isError).toBe(false));

      // Should rollback to original value
      expect(queryClient.setQueryData(['follows', 'check', followingId], true));
    });
  });
});
