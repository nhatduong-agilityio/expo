import {
  CreateNewsInput,
  News,
  NewsFilters,
  PaginatedResponse,
  PaginationParams,
  UpdateNewsInput,
} from '@/types';
import { supabase } from './supabase';

export const newsService = {
  // Get paginated news with filters
  getNews: async (
    filters: NewsFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<News>> => {
    let query = supabase
      .from('news')
      .select(
        `
        *,
        author:profiles!author_id(*),
        category:categories(*)
      `,
        { count: 'exact' },
      )
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    // Apply filters
    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`,
      );
    }

    if (filters.is_trending !== undefined) {
      query = query.eq('is_trending', filters.is_trending);
    }

    if (filters.author_id) {
      query = query.eq('author_id', filters.author_id);
    }

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil((count || 0) / pagination.limit),
    };
  },

  // Get single news by ID
  getNewsById: async (id: string): Promise<News> => {
    const { data, error } = await supabase
      .from('news')
      .select(
        `
        *,
        author:profiles!author_id(*),
        category:categories(*)
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get news by slug
  getNewsBySlug: async (slug: string): Promise<News> => {
    const { data, error } = await supabase
      .from('news')
      .select(
        `
        *,
        author:profiles!author_id(*),
        category:categories(*)
      `,
      )
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  // Create news
  createNews: async (input: CreateNewsInput): Promise<News> => {
    const slug = input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) throw new Error('Not authenticated');

    const newsData = {
      ...input,
      slug: `${slug}-${Date.now()}`,
      author_id: session.session.user.id,
      published_at:
        input.status === 'published' ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('news')
      .insert(newsData)
      .select(
        `
        *,
        author:profiles!author_id(*),
        category:categories(*)
      `,
      )
      .single();

    if (error) throw error;
    return data;
  },

  // Update news
  updateNews: async ({ id, ...input }: UpdateNewsInput): Promise<News> => {
    const updateData: any = { ...input };

    // Update published_at if status changes to published
    if (input.status === 'published') {
      const { data: existing } = await supabase
        .from('news')
        .select('published_at')
        .eq('id', id)
        .single();

      if (existing && !existing.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('news')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        author:profiles!author_id(*),
        category:categories(*)
      `,
      )
      .single();

    if (error) throw error;
    return data;
  },

  // Delete news
  deleteNews: async (id: string): Promise<void> => {
    const { error } = await supabase.from('news').delete().eq('id', id);

    if (error) throw error;
  },

  // Increment view count
  incrementViewCount: async (id: string): Promise<void> => {
    const { error } = await supabase.rpc('increment_counter', {
      table_name: 'news',
      column_name: 'views_count',
      row_id: id,
      amount: 1,
    });

    if (error) throw error;
  },

  // Get trending news
  getTrendingNews: async (limit: number = 10): Promise<News[]> => {
    const { data, error } = await supabase
      .from('news')
      .select(
        `
        *,
        author:profiles!author_id(*),
        category:categories(*)
      `,
      )
      .eq('status', 'published')
      .eq('is_trending', true)
      .order('views_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};
