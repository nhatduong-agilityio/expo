import { Bookmark, PaginatedResponse, PaginationParams } from '@/types';
import { snakeToCamel } from '@/utils';
import { supabase } from './supabase';

export const bookmarkService = {
  // Get user's bookmarks
  getBookmarks: async (
    userId: string,
    pagination: PaginationParams = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<Bookmark>> => {
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;

    const { data, error, count } = await supabase
      .from('bookmarks')
      .select(
        `
        *,
        news:news!news_id(
          *,
          author:profiles!author_id(*),
          category:categories(*)
        )
      `,
        { count: 'exact' },
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: snakeToCamel(data) || [],
      count: count || 0,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil((count || 0) / pagination.limit),
    };
  },

  // Check if news is bookmarked
  isBookmarked: async (userId: string, newsId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('news_id', newsId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  // Add bookmark
  addBookmark: async (userId: string, newsId: string): Promise<Bookmark> => {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({ user_id: userId, news_id: newsId } as never)
      .select()
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

  // Remove bookmark
  removeBookmark: async (userId: string, newsId: string): Promise<void> => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('news_id', newsId);

    if (error) throw error;
  },

  // Toggle bookmark
  toggleBookmark: async (
    userId: string,
    newsId: string,
  ): Promise<{ bookmarked: boolean }> => {
    const isBookmarked = await bookmarkService.isBookmarked(userId, newsId);

    if (isBookmarked) {
      await bookmarkService.removeBookmark(userId, newsId);
      return { bookmarked: false };
    } else {
      await bookmarkService.addBookmark(userId, newsId);
      return { bookmarked: true };
    }
  },
};
