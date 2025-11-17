import { useIsLiked, useToggleLike } from '@/hooks/useLikes';
import { mockNews } from '@/mocks/data';
import { likeService } from '@/services';
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

describe('useLikes hooks', () => {
  const user = { id: '1' };

  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ user });
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('useIsLiked', () => {
    it('should check if a news is liked', async () => {
      (likeService.isLiked as jest.Mock).mockResolvedValue(true);
      const newsId = mockNews[0].id;

      const { result } = renderHook(() => useIsLiked(newsId), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(likeService.isLiked).toHaveBeenCalledWith(user.id, newsId);
      expect(result.current.data).toBe(true);
    });

    it('should handle error when checking if news is liked fails', async () => {
      const error = new Error('Failed to check like status');
      (likeService.isLiked as jest.Mock).mockRejectedValue(error);
      const newsId = mockNews[0].id;

      const { result } = renderHook(() => useIsLiked(newsId), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(likeService.isLiked).toHaveBeenCalledWith(user.id, newsId);
      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useToggleLike', () => {
    it('should toggle a like and perform optimistic update', async () => {
      const newsId = mockNews[0].id;
      (likeService.toggleLike as jest.Mock).mockResolvedValue(undefined);
      queryClient.setQueryData(['likes', 'check', newsId], false);
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      await waitFor(() => {
        // Check optimistic update
        expect(queryClient.getQueryData(['likes', 'check', newsId])).toBe(true);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(likeService.toggleLike).toHaveBeenCalledWith(user.id, newsId);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['likes', 'check', newsId],
      });
    });

    it('should handle error and rollback optimistic update when toggle fails', async () => {
      const newsId = mockNews[0].id;
      const error = new Error('Failed to toggle like');
      (likeService.toggleLike as jest.Mock).mockRejectedValue(error);

      // Set initial state to false
      queryClient.setQueryData(['likes', 'check', newsId], false);

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      // Check optimistic update happened
      await waitFor(() => {
        expect(queryClient.getQueryData(['likes', 'check', newsId])).toBe(
          false,
        );
      });

      // Wait for error state
      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(likeService.toggleLike).toHaveBeenCalledWith(user.id, newsId);
      expect(result.current.error).toEqual(error);

      // Check rollback happened - data should be back to false
      expect(queryClient.getQueryData(['likes', 'check', newsId])).toBe(false);
    });

    it('should handle network error when toggling like', async () => {
      const newsId = mockNews[0].id;
      const networkError = new Error('Network request failed');
      (likeService.toggleLike as jest.Mock).mockRejectedValue(networkError);

      queryClient.setQueryData(['likes', 'check', newsId], true);

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(networkError);
      // Should rollback to original value
      expect(queryClient.getQueryData(['likes', 'check', newsId])).toBe(true);
    });

    it('should not perform optimistic update when no previous data exists', async () => {
      const newsId = mockNews[0].id;
      (likeService.toggleLike as jest.Mock).mockResolvedValue(undefined);

      // Don't set any initial query data - simulate no previous data
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      // Query data should remain undefined (no optimistic update)
      expect(
        queryClient.getQueryData(['likes', 'check', newsId]),
      ).toBeUndefined();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(likeService.toggleLike).toHaveBeenCalledWith(user.id, newsId);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['likes', 'check', newsId],
      });
    });

    it('should not rollback when mutation fails and no previous data exists', async () => {
      const newsId = mockNews[0].id;
      const error = new Error('Failed to toggle like');
      (likeService.toggleLike as jest.Mock).mockRejectedValue(error);

      // Don't set any initial query data
      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      // No optimistic update should happen
      expect(
        queryClient.getQueryData(['likes', 'check', newsId]),
      ).toBeUndefined();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
      // Data should still be undefined (no rollback needed)
      expect(queryClient.getQueryData(['likes', 'check', newsId])).toBe(true);
    });
  });
});
