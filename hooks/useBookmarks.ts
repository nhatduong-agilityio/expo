import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bookmarkService } from '@/services';
import { useAuthStore, useBookmarkStore } from '@/stores';
import { PaginationParams } from '@/types';

export const BOOKMARK_QUERY_KEYS = {
  all: ['bookmarks'] as const,
  lists: () => [...BOOKMARK_QUERY_KEYS.all, 'list'] as const,
  list: (userId: string) => [...BOOKMARK_QUERY_KEYS.lists(), userId] as const,
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

// Check if bookmarked
export const useIsBookmarked = (newsId: string) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [...BOOKMARK_QUERY_KEYS.all, 'check', newsId],
    queryFn: () => bookmarkService.isBookmarked(user!.id, newsId),
    enabled: !!user && !!newsId,
  });
};

// Toggle bookmark
export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { addBookmark, removeBookmark } = useBookmarkStore();

  return useMutation({
    mutationFn: (newsId: string) =>
      bookmarkService.toggleBookmark(user!.id, newsId),
    onMutate: async newsId => {
      // Optimistic update
      const isBookmarked = useBookmarkStore.getState().isBookmarked(newsId);
      if (isBookmarked) {
        removeBookmark(newsId);
      } else {
        addBookmark(newsId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKMARK_QUERY_KEYS.lists() });
    },
  });
};
