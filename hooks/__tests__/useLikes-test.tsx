import { useIsLiked, useToggleLike } from '@/hooks/useLikes';
import { NEWS_QUERY_KEYS } from '@/hooks/useNews';
import { mockNews } from '@/mocks/data';
import { likeService } from '@/services';
import { useAuthStore } from '@/stores';
import { News } from '@/types';
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

      queryClient.setQueryData(['likes', 'check', newsId], false);

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      await waitFor(() => {
        expect(queryClient.getQueryData(['likes', 'check', newsId])).toBe(
          false,
        );
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(likeService.toggleLike).toHaveBeenCalledWith(user.id, newsId);
      expect(result.current.error).toEqual(error);
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
      expect(queryClient.getQueryData(['likes', 'check', newsId])).toBe(true);
    });

    it('should not perform optimistic update when no previous data exists', async () => {
      const newsId = mockNews[0].id;
      (likeService.toggleLike as jest.Mock).mockResolvedValue(undefined);

      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

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

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      expect(
        queryClient.getQueryData(['likes', 'check', newsId]),
      ).toBeUndefined();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
      expect(queryClient.getQueryData(['likes', 'check', newsId])).toBe(true);
    });

    // NEW TESTS FOR UNCOVERED LINES

    it('should optimistically update news detail when matching newsId', async () => {
      const newsId = mockNews[0].id;
      const newsDetail: News = {
        ...mockNews[0],
        id: newsId,
        isLiked: false,
        likesCount: 5,
      };

      (likeService.toggleLike as jest.Mock).mockResolvedValue(undefined);
      queryClient.setQueryData(NEWS_QUERY_KEYS.details(), newsDetail);

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      await waitFor(() => {
        const updatedNews = queryClient.getQueryData<News>(
          NEWS_QUERY_KEYS.details(),
        );
        expect(updatedNews?.isLiked).toBe(true);
        expect(updatedNews?.likesCount).toBe(6);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('should not update news detail when newsId does not match', async () => {
      const newsId = mockNews[0].id;
      const differentNewsId = 'different-id';
      const newsDetail: News = {
        ...mockNews[0],
        id: differentNewsId,
        isLiked: false,
        likesCount: 5,
      };

      (likeService.toggleLike as jest.Mock).mockResolvedValue(undefined);
      queryClient.setQueryData(NEWS_QUERY_KEYS.details(), newsDetail);

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const updatedNews = queryClient.getQueryData<News>(
        NEWS_QUERY_KEYS.details(),
      );
      expect(updatedNews?.isLiked).toBe(false);
      expect(updatedNews?.likesCount).toBe(5);
    });

    it('should optimistically update infinite news lists', async () => {
      const newsId = mockNews[0].id;
      const infiniteData = {
        pages: [
          {
            data: [
              { ...mockNews[0], id: newsId, isLiked: false, likesCount: 10 },
              { ...mockNews[1], id: 'other-id', isLiked: true, likesCount: 5 },
            ],
            count: 2,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        ],
        pageParams: [undefined],
      };

      (likeService.toggleLike as jest.Mock).mockResolvedValue(undefined);
      queryClient.setQueryData(NEWS_QUERY_KEYS.infiniteLists(), infiniteData);

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      await waitFor(() => {
        const updated = queryClient.getQueryData<typeof infiniteData>(
          NEWS_QUERY_KEYS.infiniteLists(),
        );
        expect(updated?.pages[0].data[0].isLiked).toBe(true);
        expect(updated?.pages[0].data[0].likesCount).toBe(11);
        expect(updated?.pages[0].data[1].isLiked).toBe(true);
        expect(updated?.pages[0].data[1].likesCount).toBe(5);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('should decrease likes count when unliking in infinite lists', async () => {
      const newsId = mockNews[0].id;
      const infiniteData = {
        pages: [
          {
            data: [
              { ...mockNews[0], id: newsId, isLiked: true, likesCount: 10 },
            ],
            count: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        ],
        pageParams: [undefined],
      };

      (likeService.toggleLike as jest.Mock).mockResolvedValue(undefined);
      queryClient.setQueryData(NEWS_QUERY_KEYS.infiniteLists(), infiniteData);

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      await waitFor(() => {
        const updated = queryClient.getQueryData<typeof infiniteData>(
          NEWS_QUERY_KEYS.infiniteLists(),
        );
        expect(updated?.pages[0].data[0].isLiked).toBe(false);
        expect(updated?.pages[0].data[0].likesCount).toBe(9);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('should optimistically update regular news lists', async () => {
      const newsId = mockNews[0].id;
      const listData = {
        data: [
          { ...mockNews[0], id: newsId, isLiked: false, likesCount: 8 },
          { ...mockNews[1], id: 'other-id', isLiked: false, likesCount: 3 },
        ],
        count: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      (likeService.toggleLike as jest.Mock).mockResolvedValue(undefined);
      queryClient.setQueryData(NEWS_QUERY_KEYS.lists(), listData);

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      await waitFor(() => {
        const updated = queryClient.getQueryData<typeof listData>(
          NEWS_QUERY_KEYS.lists(),
        );
        expect(updated?.data[0].isLiked).toBe(true);
        expect(updated?.data[0].likesCount).toBe(9);
        expect(updated?.data[1].isLiked).toBe(false);
        expect(updated?.data[1].likesCount).toBe(3);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('should decrease likes count when unliking in regular lists', async () => {
      const newsId = mockNews[0].id;
      const listData = {
        data: [{ ...mockNews[0], id: newsId, isLiked: true, likesCount: 15 }],
        count: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      (likeService.toggleLike as jest.Mock).mockResolvedValue(undefined);
      queryClient.setQueryData(NEWS_QUERY_KEYS.lists(), listData);

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      await waitFor(() => {
        const updated = queryClient.getQueryData<typeof listData>(
          NEWS_QUERY_KEYS.lists(),
        );
        expect(updated?.data[0].isLiked).toBe(false);
        expect(updated?.data[0].likesCount).toBe(14);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('should not go below 0 when decreasing likes count', async () => {
      const newsId = mockNews[0].id;
      const listData = {
        data: [{ ...mockNews[0], id: newsId, isLiked: true, likesCount: 0 }],
        count: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      (likeService.toggleLike as jest.Mock).mockResolvedValue(undefined);
      queryClient.setQueryData(NEWS_QUERY_KEYS.lists(), listData);

      const { result } = renderHook(() => useToggleLike(), { wrapper });

      result.current.mutate(newsId);

      await waitFor(() => {
        const updated = queryClient.getQueryData<typeof listData>(
          NEWS_QUERY_KEYS.lists(),
        );
        expect(updated?.data[0].likesCount).toBe(0);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
  });
});
