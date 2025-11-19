import { Follow, Profile } from '@/types';
import { snakeToCamel } from '@/utils';
import { supabase } from './supabase';

export const followService = {
  // Check if following
  isFollowing: async (
    followerId: string,
    followingId: string,
  ): Promise<boolean> => {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  // Follow user
  followUser: async (
    followerId: string,
    followingId: string,
  ): Promise<Follow> => {
    const { data, error } = await supabase
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId } as never)
      .select()
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

  // Unfollow user
  unfollowUser: async (
    followerId: string,
    followingId: string,
  ): Promise<void> => {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
  },

  // Toggle follow
  toggleFollow: async (
    followerId: string,
    followingId: string,
  ): Promise<{ following: boolean }> => {
    const isFollowing = await followService.isFollowing(
      followerId,
      followingId,
    );

    if (isFollowing) {
      await followService.unfollowUser(followerId, followingId);
      return { following: false };
    } else {
      await followService.followUser(followerId, followingId);
      return { following: true };
    }
  },

  // Get followers
  getFollowers: async (userId: string): Promise<Profile[]> => {
    const { data, error } = await supabase
      .from('follows')
      .select('follower:profiles!follower_id(*)')
      .eq('following_id', userId);

    if (error) throw error;

    const followers =
      data?.map((item: { follower: never }) => item.follower) || [];

    return snakeToCamel(followers);
  },

  // Get following
  getFollowing: async (userId: string): Promise<Profile[]> => {
    const { data, error } = await supabase
      .from('follows')
      .select('following:profiles!following_id(*)')
      .eq('follower_id', userId);

    if (error) throw error;

    const following =
      data?.map((item: { following: never }) => item.following) || [];

    return snakeToCamel(following);
  },
};
