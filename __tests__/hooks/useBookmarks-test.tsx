import {
  useBookmarks,
  useIsBookmarked,
  useToggleBookmark,
} from '@/hooks/useBookmarks';
import { mockNews } from '@/mocks/data';
import { bookmarkService } from '@/services';
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

describe('useBookmarks hooks', () => {
  const user = { id: '1' };

  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ user });
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('useBookmarks', () => {
    it('should fetch user bookmarks', async () => {
      (bookmarkService.getBookmarks as jest.Mock).mockResolvedValue(mockNews);

      const { result } = renderHook(() => useBookmarks(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(bookmarkService.getBookmarks).toHaveBeenCalledWith(user.id, {
        page: 1,
        limit: 10,
      });
      expect(result.current.data).toEqual(mockNews);
    });
  });

  describe('useIsBookmarked', () => {
    it('should check if a news is bookmarked', async () => {
      (bookmarkService.isBookmarked as jest.Mock).mockResolvedValue(true);

      const { result } = renderHook(() => useIsBookmarked(mockNews[0].id), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(bookmarkService.isBookmarked).toHaveBeenCalledWith(
        user.id,
        mockNews[0].id,
      );
      expect(result.current.data).toBe(true);
    });
  });

  describe('useToggleBookmark', () => {
    it('should toggle a bookmark and perform optimistic update', async () => {
      const newsId = mockNews[0].id;
      (bookmarkService.toggleBookmark as jest.Mock).mockResolvedValue(
        undefined,
      );
      queryClient.setQueryData(['bookmarks', 'check', newsId], false);
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useToggleBookmark(), { wrapper });

      result.current.mutate(newsId);

      await waitFor(() => {
        // Check optimistic update
        expect(queryClient.getQueryData(['bookmarks', 'check', newsId])).toBe(
          true,
        );
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(bookmarkService.toggleBookmark).toHaveBeenCalledWith(
        user.id,
        newsId,
      );
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['bookmarks', 'check', newsId],
      });
    });

    it('should handle network error when toggling bookmark', async () => {
      const networkError = new Error('Network request failed');
      const newsId = mockNews[0].id;
      (bookmarkService.toggleBookmark as jest.Mock).mockResolvedValue(
        Promise.reject(networkError),
      );

      queryClient.setQueryData(['bookmarks', 'check', newsId], false);

      const { result } = renderHook(() => useToggleBookmark(), { wrapper });

      result.current.mutate(newsId);

      await waitFor(() => expect(result.current.isError).toBe(false));

      // Should rollback to original value
      expect(queryClient.setQueryData(['bookmarks', 'check', newsId], true));
    });
  });
});
