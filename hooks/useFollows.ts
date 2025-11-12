import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Services
import { followService } from '@/services';

// Stores
import { useAuthStore } from '@/stores';

// Types
import { Profile } from '@/types';

// Hooks
import { PROFILE_QUERY_KEYS } from './useProfile';

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

// Toggle follow with optimistic update
export const useToggleFollow = () => {
  const queryClient = useQueryClient();
  const { user, profile, setProfile } = useAuthStore();

  return useMutation({
    mutationFn: (followingId: string) =>
      followService.toggleFollow(user!.id, followingId),

    // Optimistic update
    onMutate: async followingId => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: FOLLOW_QUERY_KEYS.check(followingId),
      });
      await queryClient.cancelQueries({
        queryKey: PROFILE_QUERY_KEYS.all,
      });

      // Snapshot previous values
      const previousIsFollowing = queryClient.getQueryData<boolean>(
        FOLLOW_QUERY_KEYS.check(followingId),
      );

      const previousTargetProfile = queryClient.getQueryData<Profile>(
        PROFILE_QUERY_KEYS.detail(followingId),
      );

      // Optimistically update check status
      queryClient.setQueryData<boolean>(
        FOLLOW_QUERY_KEYS.check(followingId),
        old => !old,
      );

      // Optimistically update target profile followers count
      queryClient.setQueryData<Profile>(
        PROFILE_QUERY_KEYS.detail(followingId),
        old => {
          if (!old) return old;
          return {
            ...old,
            followersCount: previousIsFollowing
              ? Math.max(0, old.followersCount - 1)
              : old.followersCount + 1,
          };
        },
      );

      // Optimistically update current user's following count in store
      if (profile) {
        setProfile({
          ...profile,
          followingCount: previousIsFollowing
            ? Math.max(0, profile.followingCount - 1)
            : profile.followingCount + 1,
        });
      }

      // Optimistically update current user's profile in cache
      queryClient.setQueryData<Profile>(
        PROFILE_QUERY_KEYS.detail(user!.id),
        old => {
          if (!old) return old;
          return {
            ...old,
            followingCount: previousIsFollowing
              ? Math.max(0, old.followingCount - 1)
              : old.followingCount + 1,
          };
        },
      );

      return { previousIsFollowing, previousTargetProfile };
    },

    // On error, rollback
    onError: (_err, followingId, context) => {
      if (context?.previousIsFollowing !== undefined) {
        queryClient.setQueryData(
          FOLLOW_QUERY_KEYS.check(followingId),
          context.previousIsFollowing,
        );
      }
      if (context?.previousTargetProfile) {
        queryClient.setQueryData(
          PROFILE_QUERY_KEYS.detail(followingId),
          context.previousTargetProfile,
        );
      }
    },

    // Always refetch after error or success
    onSettled: async (_data, _error, followingId) => {
      await queryClient.invalidateQueries({
        queryKey: FOLLOW_QUERY_KEYS.check(followingId),
      });
      await queryClient.invalidateQueries({
        queryKey: FOLLOW_QUERY_KEYS.followers(followingId),
      });
      await queryClient.invalidateQueries({
        queryKey: FOLLOW_QUERY_KEYS.following(user!.id),
      });
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEYS.detail(followingId),
      });
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEYS.detail(user!.id),
      });

      // Sync profile from server
      const updatedProfile = await queryClient.fetchQuery({
        queryKey: PROFILE_QUERY_KEYS.detail(user!.id),
        queryFn: () => followService.getFollowing(user!.id),
      });

      if (updatedProfile && profile) {
        setProfile({
          ...profile,
          followingCount:
            (updatedProfile as any).length || profile.followingCount,
        });
      }
    },
  });
};
