import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Services
import { likeService } from '@/services';

// Stores
import { useAuthStore } from '@/stores';

// Types
import { News } from '@/types';

// Hooks
import { NEWS_QUERY_KEYS } from './useNews';

export const LIKE_QUERY_KEYS = {
  all: ['likes'] as const,
  check: (newsId: string) => [...LIKE_QUERY_KEYS.all, 'check', newsId] as const,
};

// Check if liked
export const useIsLiked = (newsId: string) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: LIKE_QUERY_KEYS.check(newsId),
    queryFn: () => likeService.isLiked(user!.id, newsId),
    enabled: !!user && !!newsId,
  });
};

// Toggle like with optimistic update
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (newsId: string) => likeService.toggleLike(user!.id, newsId),

    // Optimistic update
    onMutate: async newsId => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: LIKE_QUERY_KEYS.check(newsId),
      });
      await queryClient.cancelQueries({
        queryKey: NEWS_QUERY_KEYS.all,
      });

      // Snapshot previous values
      const previousIsLiked = queryClient.getQueryData<boolean>(
        LIKE_QUERY_KEYS.check(newsId),
      );

      // Optimistically update check status
      queryClient.setQueryData<boolean>(
        LIKE_QUERY_KEYS.check(newsId),
        old => !old,
      );

      // Optimistically update news detail
      queryClient.setQueriesData<News>(
        { queryKey: NEWS_QUERY_KEYS.details() },
        old => {
          if (old && old.id === newsId) {
            return {
              ...old,
              isLiked: !old.isLiked,
              likesCount: old.isLiked
                ? Math.max(0, old.likesCount - 1)
                : old.likesCount + 1,
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
                    isLiked: !news.isLiked,
                    likesCount: news.isLiked
                      ? Math.max(0, news.likesCount - 1)
                      : news.likesCount + 1,
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
                  isLiked: !news.isLiked,
                  likesCount: news.isLiked
                    ? Math.max(0, news.likesCount - 1)
                    : news.likesCount + 1,
                }
              : news,
          ),
        };
      });

      return { previousIsLiked };
    },

    // On error, rollback
    onError: (_err, newsId, context) => {
      if (context?.previousIsLiked !== undefined) {
        queryClient.setQueryData(
          LIKE_QUERY_KEYS.check(newsId),
          context.previousIsLiked,
        );
      }
    },

    // Always refetch after error or success
    onSettled: (_data, _error, newsId) => {
      queryClient.invalidateQueries({
        queryKey: LIKE_QUERY_KEYS.check(newsId),
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
