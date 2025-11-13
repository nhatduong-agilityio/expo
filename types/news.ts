export interface Profile {
  id: string;
  username: string | null;
  fullName: string | null;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
  followersCount: number;
  followingCount: number;
  newsCount: number;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface News {
  id: string;
  authorId: string;
  categoryId: string | null;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  status: 'draft' | 'published' | 'archived';
  isTrending: boolean;
  viewsCount: number;
  likesCount: number;
  bookmarksCount: number;
  commentsCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  author?: Profile;
  category?: Category;
  isBookmarked?: boolean;
  isLiked?: boolean;
}

export interface Bookmark {
  id: string;
  userId: string;
  newsId: string;
  createdAt: string;
  news?: News;
}

export interface Like {
  id: string;
  userId: string;
  newsId: string;
  createdAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower?: Profile;
  following?: Profile;
}

export interface Comment {
  id: string;
  newsId: string;
  userId: string;
  parentId: string | null;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  user?: Profile;
  replies?: Comment[];
}

export interface TopicSubscription {
  id: string;
  userId: string;
  categoryId: string;
  createdAt: string;
  category?: Category;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'news_published';
  title: string;
  message: string;
  data: Record<string, any> | null;
  isRead: boolean;
  createdAt: string;
}

// Request/Response types
export interface NewsFilters {
  category?: string;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  isTrending?: boolean;
  authorId?: string;
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

export interface CreateNewsInput {
  title: string;
  content: string;
  excerpt?: string;
  categoryId?: string;
  featuredImageUrl?: string;
  status?: 'draft' | 'published';
}

export interface UpdateNewsInput extends Partial<CreateNewsInput> {
  id: string;
}

export interface UpdateProfileInput {
  username?: string;
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  bio?: string;
  website?: string;
}

export interface Author extends Profile {
  following: boolean;
}

export interface Topic extends Category {
  saved: boolean;
}
