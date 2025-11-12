import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { categoryService } from '@/services';
import { useAuthStore } from '@/stores';

export const CATEGORY_QUERY_KEYS = {
  all: ['categories'] as const,
  lists: () => [...CATEGORY_QUERY_KEYS.all, 'list'] as const,
  subscriptions: (userId: string) =>
    [...CATEGORY_QUERY_KEYS.all, 'subscriptions', userId] as const,
  check: (categoryId: string) =>
    [...CATEGORY_QUERY_KEYS.all, 'check', categoryId] as const,
};

// Get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.lists(),
    queryFn: () => categoryService.getCategories(),
  });
};

// Get subscribed topics
export const useSubscribedTopics = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.subscriptions(user?.id || ''),
    queryFn: () => categoryService.getSubscribedTopics(user!.id),
    enabled: !!user,
  });
};

// Check if subscribed
export const useIsSubscribed = (categoryId: string) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.check(categoryId),
    queryFn: () => categoryService.isSubscribed(user!.id, categoryId),
    enabled: !!user && !!categoryId,
  });
};

// Toggle subscription
export const useToggleSubscription = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (categoryId: string) =>
      categoryService.toggleSubscription(user!.id, categoryId),
    onSuccess: (_, categoryId) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.check(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.subscriptions(user!.id),
      });
    },
  });
};
