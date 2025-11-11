export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          email: string;
          phone_number: string | null;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          followers_count: number;
          following_count: number;
          news_count: number;
          profile_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          email: string;
          phone_number?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          followers_count?: number;
          following_count?: number;
          news_count?: number;
          profile_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          email?: string;
          phone_number?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          followers_count?: number;
          following_count?: number;
          news_count?: number;
          profile_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      news: {
        Row: {
          id: string;
          author_id: string;
          category_id: string | null;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          featured_image_url: string | null;
          status: 'draft' | 'published' | 'archived';
          is_trending: boolean;
          views_count: number;
          likes_count: number;
          bookmarks_count: number;
          comments_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          category_id?: string | null;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          featured_image_url?: string | null;
          status?: 'draft' | 'published' | 'archived';
          is_trending?: boolean;
          views_count?: number;
          likes_count?: number;
          bookmarks_count?: number;
          comments_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          category_id?: string | null;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          featured_image_url?: string | null;
          status?: 'draft' | 'published' | 'archived';
          is_trending?: boolean;
          views_count?: number;
          likes_count?: number;
          bookmarks_count?: number;
          comments_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          news_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          news_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          news_id?: string;
          created_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          news_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          news_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          news_id?: string;
          created_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          news_id: string;
          user_id: string;
          parent_id: string | null;
          content: string;
          is_edited: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          news_id: string;
          user_id: string;
          parent_id?: string | null;
          content: string;
          is_edited?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          news_id?: string;
          user_id?: string;
          parent_id?: string | null;
          content?: string;
          is_edited?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      topic_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'like' | 'comment' | 'follow' | 'mention' | 'news_published';
          title: string;
          message: string;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'like' | 'comment' | 'follow' | 'mention' | 'news_published';
          title: string;
          message: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'like' | 'comment' | 'follow' | 'mention' | 'news_published';
          title?: string;
          message?: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
