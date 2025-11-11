export interface Profile {
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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface News {
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
  // Relations
  author?: Profile;
  category?: Category;
  is_bookmarked?: boolean;
  is_liked?: boolean;
}

export interface NewsFilters {
  category?: string;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  is_trending?: boolean;
  author_id?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}
