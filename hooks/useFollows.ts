import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { followService } from '@/services';
import { useAuthStore } from '@/stores';

export const FOLLOW_QUERY_KEYS = {
  all: ['follows'] as const,
  check: (followingId: string) =>
    [...FOLLOW_QUERY_KEYS.all, 'check', followingId] as const,
  followers: (userId: string) =>
    [...FOLLOW_QUERY_KEYS.all, 'followers', userId] as const,
  following: (userId: string) =>
    [...FOLLOW_QUERY_KEYS.all, 'following', userId] as const,
};

// Check if following
export const useIsFollowing = (followingId: string) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: FOLLOW_QUERY_KEYS.check(followingId),
    queryFn: () => followService.isFollowing(user!.id, followingId),
    enabled: !!user && !!followingId,
  });
};

// Get followers
export const useFollowers = (userId: string) => {
  return useQuery({
    queryKey: FOLLOW_QUERY_KEYS.followers(userId),
    queryFn: () => followService.getFollowers(userId),
    enabled: !!userId,
  });
};

// Get following
export const useFollowing = (userId: string) => {
  return useQuery({
    queryKey: FOLLOW_QUERY_KEYS.following(userId),
    queryFn: () => followService.getFollowing(userId),
    enabled: !!userId,
  });
};

// Toggle follow
export const useToggleFollow = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (followingId: string) =>
      followService.toggleFollow(user!.id, followingId),
    onSuccess: (_, followingId) => {
      queryClient.invalidateQueries({
        queryKey: FOLLOW_QUERY_KEYS.check(followingId),
      });
      queryClient.invalidateQueries({
        queryKey: FOLLOW_QUERY_KEYS.followers(followingId),
      });
      queryClient.invalidateQueries({
        queryKey: FOLLOW_QUERY_KEYS.following(user!.id),
      });
    },
  });
};
