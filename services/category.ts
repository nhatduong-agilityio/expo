import { Category, TopicSubscription } from '@/types';
import { snakeToCamel } from '@/utils';
import { supabase } from './supabase';

export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return snakeToCamel(data) || [];
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

  // Get user's subscribed topics
  getSubscribedTopics: async (userId: string): Promise<TopicSubscription[]> => {
    const { data, error } = await supabase
      .from('topic_subscriptions')
      .select('*, category:categories(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return snakeToCamel(data) || [];
  },

  // Check if subscribed to topic
  isSubscribed: async (
    userId: string,
    categoryId: string,
  ): Promise<boolean> => {
    const { data, error } = await supabase
      .from('topic_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  // Subscribe to topic
  subscribeTopic: async (
    userId: string,
    categoryId: string,
  ): Promise<TopicSubscription> => {
    const { data, error } = await supabase
      .from('topic_subscriptions')
      .insert({ user_id: userId, category_id: categoryId })
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

  // Unsubscribe from topic
  unsubscribeTopic: async (
    userId: string,
    categoryId: string,
  ): Promise<void> => {
    const { error } = await supabase
      .from('topic_subscriptions')
      .delete()
      .eq('user_id', userId)
      .eq('category_id', categoryId);

    if (error) throw error;
  },

  // Toggle subscription
  toggleSubscription: async (
    userId: string,
    categoryId: string,
  ): Promise<{ subscribed: boolean }> => {
    const isSubscribed = await categoryService.isSubscribed(userId, categoryId);

    if (isSubscribed) {
      await categoryService.unsubscribeTopic(userId, categoryId);
      return { subscribed: false };
    } else {
      await categoryService.subscribeTopic(userId, categoryId);
      return { subscribed: true };
    }
  },
};
