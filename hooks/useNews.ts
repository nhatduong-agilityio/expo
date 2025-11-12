import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

// Services
import { newsService } from '@/services';

// Types
import {
  CreateNewsInput,
  NewsFilters,
  PaginationParams,
  UpdateNewsInput,
} from '@/types';

export const NEWS_QUERY_KEYS = {
  all: ['news'] as const,
  lists: () => [...NEWS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: NewsFilters, pagination?: PaginationParams) =>
    [...NEWS_QUERY_KEYS.lists(), { filters, pagination }] as const,
  infiniteLists: () => [...NEWS_QUERY_KEYS.all, 'infiniteList'] as const,
  infiniteList: (filters: NewsFilters) =>
    [...NEWS_QUERY_KEYS.infiniteLists(), { filters }] as const,
  details: () => [...NEWS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...NEWS_QUERY_KEYS.details(), id] as const,
  trending: () => [...NEWS_QUERY_KEYS.all, 'trending'] as const,
};

// Get paginated news (for regular pagination)
export const useNews = (
  filters: NewsFilters = {},
  pagination: PaginationParams = { page: 1, limit: 10 },
) => {
  return useQuery({
    queryKey: NEWS_QUERY_KEYS.list(filters, pagination),
    queryFn: () => newsService.getNews(filters, pagination),
  });
};

// Get infinite scroll news (separate key structure)
export const useInfiniteNews = (filters: NewsFilters = {}, limit = 10) => {
  return useInfiniteQuery({
    queryKey: NEWS_QUERY_KEYS.infiniteList(filters),
    queryFn: ({ pageParam = 1 }) =>
      newsService.getNews(filters, { page: pageParam, limit }),
    getNextPageParam: lastPage => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

// Get single news
export const useNewsDetail = (id: string) => {
  return useQuery({
    queryKey: NEWS_QUERY_KEYS.detail(id),
    queryFn: () => newsService.getNewsById(id),
    enabled: !!id,
  });
};

// Get trending news
export const useTrendingNews = (limit = 10) => {
  return useQuery({
    queryKey: NEWS_QUERY_KEYS.trending(),
    queryFn: () => newsService.getTrendingNews(limit),
  });
};

// Create news
export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateNewsInput) => newsService.createNews(input),
    onSuccess: () => {
      // Invalidate both regular lists and infinite lists
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.infiniteLists(),
      });
    },
  });
};

// Update news
export const useUpdateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateNewsInput) => newsService.updateNews(input),
    onSuccess: (data, variables) => {
      // Update detail
      queryClient.setQueryData(NEWS_QUERY_KEYS.detail(variables.id), data);

      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.infiniteLists(),
      });
    },
  });
};

// Delete news
export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => newsService.deleteNews(id),
    onSuccess: (_data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: NEWS_QUERY_KEYS.detail(id) });

      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.infiniteLists(),
      });
    },
  });
};

// Increment view count
export const useIncrementViewCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => newsService.incrementViewCount(id),
    onSuccess: (_data, id) => {
      // Optionally invalidate the detail to refresh view count
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.detail(id),
        refetchType: 'none', // Don't refetch immediately
      });
    },
  });
};
