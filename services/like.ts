import { Like } from '@/types';
import { supabase } from './supabase';

export const likeService = {
  // Check if news is liked
  isLiked: async (userId: string, newsId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('news_id', newsId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  // Add like
  addLike: async (userId: string, newsId: string): Promise<Like> => {
    const { data, error } = await supabase
      .from('likes')
      .insert({ user_id: userId, news_id: newsId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove like
  removeLike: async (userId: string, newsId: string): Promise<void> => {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('news_id', newsId);

    if (error) throw error;
  },

  // Toggle like
  toggleLike: async (
    userId: string,
    newsId: string,
  ): Promise<{ liked: boolean }> => {
    const isLiked = await likeService.isLiked(userId, newsId);

    if (isLiked) {
      await likeService.removeLike(userId, newsId);
      return { liked: false };
    } else {
      await likeService.addLike(userId, newsId);
      return { liked: true };
    }
  },
};
