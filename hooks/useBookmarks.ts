import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

// Services
import { bookmarkService } from '@/services';

// Stores
import { useAuthStore } from '@/stores';

// Types
import { News, PaginationParams } from '@/types';

// Hooks
import { NEWS_QUERY_KEYS } from './useNews';

export const BOOKMARK_QUERY_KEYS = {
  all: ['bookmarks'],
  lists: () => [...BOOKMARK_QUERY_KEYS.all, 'list'],
  list: (userId: string) => [...BOOKMARK_QUERY_KEYS.lists(), userId],
  infiniteList: (userId: string) => [
    ...BOOKMARK_QUERY_KEYS.all,
    'infiniteList',
    userId,
  ],
  check: (newsId: string) => [...BOOKMARK_QUERY_KEYS.all, 'check', newsId],
};

// Get user bookmarks
export const useBookmarks = (
  pagination: PaginationParams = { page: 1, limit: 10 },
) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: BOOKMARK_QUERY_KEYS.list(user?.id || ''),
    queryFn: () => bookmarkService.getBookmarks(user!.id, pagination),
    enabled: !!user,
  });
};

// Get user bookmarks with infinite scroll
export const useInfiniteBookmarks = (limit = 10) => {
  const { user } = useAuthStore();

  return useInfiniteQuery({
    queryKey: BOOKMARK_QUERY_KEYS.infiniteList(user?.id || ''),
    queryFn: ({ pageParam = 1 }) =>
      bookmarkService.getBookmarks(user!.id, { page: pageParam, limit }),
    getNextPageParam: lastPage => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!user,
  });
};

// Check if bookmarked
export const useIsBookmarked = (newsId: string) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: BOOKMARK_QUERY_KEYS.check(newsId),
    queryFn: () => bookmarkService.isBookmarked(user!.id, newsId),
    enabled: !!user && !!newsId,
  });
};

// Toggle bookmark with optimistic update
export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (newsId: string) =>
      bookmarkService.toggleBookmark(user!.id, newsId),

    // Optimistic update
    onMutate: async newsId => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: BOOKMARK_QUERY_KEYS.check(newsId),
      });
      await queryClient.cancelQueries({
        queryKey: BOOKMARK_QUERY_KEYS.lists(),
      });
      await queryClient.cancelQueries({
        queryKey: NEWS_QUERY_KEYS.all,
      });

      // Snapshot previous values
      const previousIsBookmarked = queryClient.getQueryData<boolean>(
        BOOKMARK_QUERY_KEYS.check(newsId),
      );

      // Optimistically update check status
      queryClient.setQueryData<boolean>(
        BOOKMARK_QUERY_KEYS.check(newsId),
        old => !old,
      );

      // Optimistically update news detail
      queryClient.setQueriesData<News>(
        { queryKey: NEWS_QUERY_KEYS.details() },
        old => {
          if (old && old.id === newsId) {
            return {
              ...old,
              isBookmarked: !old.isBookmarked,
              bookmarksCount: old.isBookmarked
                ? Math.max(0, old.bookmarksCount - 1)
                : old.bookmarksCount + 1,
            };
          }
          return old;
        },
      );

      // Optimistically update infinite news lists
      queryClient.setQueriesData<{
        pages: {
          data: News[];
          count: number;
          page: number;
          limit: number;
          totalPages: number;
        }[];
        pageParams: unknown[];
      }>({ queryKey: NEWS_QUERY_KEYS.infiniteLists() }, old => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            data: page.data.map(news =>
              news.id === newsId
                ? {
                    ...news,
                    isBookmarked: !news.isBookmarked,
                    bookmarksCount: news.isBookmarked
                      ? Math.max(0, news.bookmarksCount - 1)
                      : news.bookmarksCount + 1,
                  }
                : news,
            ),
          })),
        };
      });

      // Optimistically update regular news lists
      queryClient.setQueriesData<{
        data: News[];
        count: number;
        page: number;
        limit: number;
        totalPages: number;
      }>({ queryKey: NEWS_QUERY_KEYS.lists() }, old => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(news =>
            news.id === newsId
              ? {
                  ...news,
                  isBookmarked: !news.isBookmarked,
                  bookmarksCount: news.isBookmarked
                    ? Math.max(0, news.bookmarksCount - 1)
                    : news.bookmarksCount + 1,
                }
              : news,
          ),
        };
      });

      return { previousIsBookmarked };
    },

    // On error, rollback
    onError: (_err, newsId, context) => {
      if (context?.previousIsBookmarked !== undefined) {
        queryClient.setQueryData(
          BOOKMARK_QUERY_KEYS.check(newsId),
          context.previousIsBookmarked,
        );
      }
    },

    // Always refetch after error or success
    onSettled: (_data, _error, newsId) => {
      queryClient.invalidateQueries({
        queryKey: BOOKMARK_QUERY_KEYS.check(newsId),
      });
      queryClient.invalidateQueries({
        queryKey: BOOKMARK_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: BOOKMARK_QUERY_KEYS.infiniteList(user!.id),
      });
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.detail(newsId),
      });
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.infiniteLists(),
      });
    },
  });
};
