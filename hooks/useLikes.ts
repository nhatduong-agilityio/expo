import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { likeService } from '@/services';
import { useAuthStore } from '@/stores';

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

// Toggle like
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (newsId: string) => likeService.toggleLike(user!.id, newsId),
    onSuccess: (_, newsId) => {
      queryClient.invalidateQueries({
        queryKey: LIKE_QUERY_KEYS.check(newsId),
      });
    },
  });
};
