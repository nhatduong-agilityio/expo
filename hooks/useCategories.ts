import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Services
import { categoryService } from '@/services';

// Stores
import { useAuthStore } from '@/stores';

// Types
import { Category, TopicSubscription } from '@/types';

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

// Toggle subscription with optimistic update
export const useToggleSubscription = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (categoryId: string) =>
      categoryService.toggleSubscription(user!.id, categoryId),

    // Optimistic update
    onMutate: async categoryId => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: CATEGORY_QUERY_KEYS.check(categoryId),
      });
      await queryClient.cancelQueries({
        queryKey: CATEGORY_QUERY_KEYS.subscriptions(user!.id),
      });

      // Snapshot previous values
      const previousIsSubscribed = queryClient.getQueryData<boolean>(
        CATEGORY_QUERY_KEYS.check(categoryId),
      );

      const previousSubscriptions = queryClient.getQueryData<
        TopicSubscription[]
      >(CATEGORY_QUERY_KEYS.subscriptions(user!.id));

      // Optimistically update check status
      queryClient.setQueryData<boolean>(
        CATEGORY_QUERY_KEYS.check(categoryId),
        old => !old,
      );

      // Optimistically update subscriptions list
      queryClient.setQueryData<TopicSubscription[]>(
        CATEGORY_QUERY_KEYS.subscriptions(user!.id),
        old => {
          if (!old) return old;

          if (previousIsSubscribed) {
            // Remove subscription
            return old.filter(sub => sub.categoryId !== categoryId);
          } else {
            // Add subscription (we'll get the full data on success)
            const category = queryClient
              .getQueryData<Category[]>(CATEGORY_QUERY_KEYS.lists())
              ?.find(cat => cat.id === categoryId);

            if (category) {
              return [
                ...old,
                {
                  id: `temp-${categoryId}`,
                  userId: user!.id,
                  categoryId,
                  createdAt: new Date().toISOString(),
                  category,
                },
              ];
            }
          }
          return old;
        },
      );

      return { previousIsSubscribed, previousSubscriptions };
    },

    // On error, rollback
    onError: (_err, categoryId, context) => {
      if (context?.previousIsSubscribed !== undefined) {
        queryClient.setQueryData(
          CATEGORY_QUERY_KEYS.check(categoryId),
          context.previousIsSubscribed,
        );
      }
      if (context?.previousSubscriptions) {
        queryClient.setQueryData(
          CATEGORY_QUERY_KEYS.subscriptions(user!.id),
          context.previousSubscriptions,
        );
      }
    },

    // Always refetch after error or success
    onSettled: (_data, _error, categoryId) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.check(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.subscriptions(user!.id),
      });
    },
  });
};
