import { useInfiniteQuery } from '@tanstack/react-query';

// Services
import { authService } from '@/services';

// Stores
import { useAuthStore } from '@/stores';

export const AUTHOR_QUERY_KEYS = {
  all: ['authors'] as const,
  search: (query: string) =>
    [...AUTHOR_QUERY_KEYS.all, 'search', query] as const,
};

// Search authors with infinite scroll
export const useInfiniteAuthors = (searchQuery: string, limit = 10) => {
  const { user } = useAuthStore();

  return useInfiniteQuery({
    queryKey: AUTHOR_QUERY_KEYS.search(searchQuery),
    queryFn: ({ pageParam = 1 }) =>
      authService.searchAuthors(searchQuery, { page: pageParam, limit }),
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
