import { mockNews } from '@/mocks';
import { newsService, supabase } from '@/services';
import { CreateNewsInput, UpdateNewsInput } from '@/types';

jest.mock('@/services/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    rpc: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    auth: {
      getSession: jest.fn(),
    },
  },
}));

describe('newsService', () => {
  beforeEach(() => {
    // Default mock for auth session
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user-id',
          },
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getNews', () => {
    it('should fetch news with default filters and pagination', async () => {
      const mockNewsData = mockNews.slice(0, 10);
      const mockResponse = {
        data: mockNewsData,
        error: null,
        count: mockNewsData.length,
      };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getNews();

      expect(supabase.from).toHaveBeenCalledWith('news');
      expect(result.data).toEqual(mockNewsData);
      expect(result.count).toBe(mockNewsData.length);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should fetch news with category filter', async () => {
      const mockNewsData = mockNews.slice(0, 5);
      const mockResponse = {
        data: mockNewsData,
        error: null,
        count: mockNewsData.length,
      };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getNews(
        { category: 'category-id' },
        { page: 1, limit: 5 },
      );

      expect(result.data).toEqual(mockNewsData);
    });

    it('should fetch news with search filter', async () => {
      const mockNewsData = mockNews.slice(0, 5);
      const mockResponse = {
        data: mockNewsData,
        error: null,
        count: mockNewsData.length,
      };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getNews(
        { search: 'test search' },
        { page: 1, limit: 5 },
      );

      expect(result.data).toEqual(mockNewsData);
    });

    it('should fetch news with isTrending filter set to true', async () => {
      const mockNewsData = mockNews.slice(0, 5);
      const mockResponse = {
        data: mockNewsData,
        error: null,
        count: mockNewsData.length,
      };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getNews(
        { isTrending: true },
        { page: 1, limit: 5 },
      );

      expect(result.data).toEqual(mockNewsData);
    });

    it('should fetch news with isTrending filter set to false', async () => {
      const mockNewsData = mockNews.slice(0, 5);
      const mockResponse = {
        data: mockNewsData,
        error: null,
        count: mockNewsData.length,
      };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getNews(
        { isTrending: false },
        { page: 1, limit: 5 },
      );

      expect(result.data).toEqual(mockNewsData);
    });

    it('should fetch news with authorId filter', async () => {
      const mockNewsData = mockNews.slice(0, 5);
      const mockResponse = {
        data: mockNewsData,
        error: null,
        count: mockNewsData.length,
      };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getNews(
        { authorId: 'author-id' },
        { page: 1, limit: 5 },
      );

      expect(result.data).toEqual(mockNewsData);
    });

    it('should throw error if fetching news fails', async () => {
      const mockError = new Error('Failed to fetch news');

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce({
          data: null,
          error: mockError,
          count: null,
        }),
      });

      await expect(newsService.getNews()).rejects.toThrow(mockError);
    });
  });

  describe('getNewsById', () => {
    it('should fetch a single news by id', async () => {
      const mockNew = mockNews[0];
      const mockResponse = { data: mockNew, error: null };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getNewsById(mockNew.id);

      expect(supabase.from).toHaveBeenCalledWith('news');
      expect(result).toEqual(mockNew);
    });

    it('should throw error if fetching news by id fails', async () => {
      const mockError = new Error('News not found');

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({
          data: null,
          error: mockError,
        }),
      });

      await expect(newsService.getNewsById('invalid-id')).rejects.toThrow(
        mockError,
      );
    });
  });

  describe('getNewsBySlug', () => {
    it('should fetch a single news by slug', async () => {
      const mockNew = mockNews[0];
      const mockResponse = { data: mockNew, error: null };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getNewsBySlug('test-slug');

      expect(supabase.from).toHaveBeenCalledWith('news');
      expect(result).toEqual(mockNew);
    });

    it('should throw error if fetching news by slug fails', async () => {
      const mockError = new Error('News not found');

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({
          data: null,
          error: mockError,
        }),
      });

      await expect(newsService.getNewsBySlug('invalid-slug')).rejects.toThrow(
        mockError,
      );
    });
  });

  describe('createNews', () => {
    it('should create a new news with published status', async () => {
      const mockNew = mockNews[0];
      const input = {
        title: mockNew.title,
        content: mockNew.content,
        featuredImageUrl: mockNew.featuredImageUrl,
        categoryId: mockNew.categoryId,
        status: 'published',
      } as CreateNewsInput;
      const mockResponse = { data: mockNew, error: null };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.createNews(input);

      expect(supabase.from).toHaveBeenCalledWith('news');
      expect(result).toEqual(mockNew);
    });

    it('should create a new news with draft status', async () => {
      const mockNew = mockNews[0];
      const input = {
        title: mockNew.title,
        content: mockNew.content,
        featuredImageUrl: mockNew.featuredImageUrl,
        categoryId: mockNew.categoryId,
        status: 'draft',
      } as CreateNewsInput;
      const mockResponse = { data: mockNew, error: null };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.createNews(input);

      expect(result).toEqual(mockNew);
    });

    it('should throw error if user is not authenticated', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
        data: {
          session: null,
        },
      });

      const input = {
        title: 'Test',
        content: 'Content',
        featuredImageUrl: 'url',
        categoryId: 'cat-id',
        status: 'draft',
      } as CreateNewsInput;

      await expect(newsService.createNews(input)).rejects.toThrow(
        'Not authenticated',
      );
    });

    it('should throw error if creating news fails', async () => {
      const mockError = new Error('Failed to create news');
      const input = {
        title: 'Test',
        content: 'Content',
        featuredImageUrl: 'url',
        categoryId: 'cat-id',
        status: 'draft',
      } as CreateNewsInput;

      (supabase.from as jest.Mock).mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({
          data: null,
          error: mockError,
        }),
      });

      await expect(newsService.createNews(input)).rejects.toThrow(mockError);
    });
  });

  describe('updateNews', () => {
    it('should update news without changing status', async () => {
      const mockNew = mockNews[0];
      const input = {
        id: mockNew.id,
        title: 'Updated Title',
      } as UpdateNewsInput;
      const mockResponse = {
        data: {
          ...mockNew,
          title: 'Updated Title',
        },
        error: null,
      };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.updateNews(input);

      expect(supabase.from).toHaveBeenCalledWith('news');
      expect(result.title).toBe('Updated Title');
    });

    it('should update news and set published_at when changing status to published for first time', async () => {
      const mockNew = mockNews[0];
      const input = {
        id: mockNew.id,
        status: 'published',
      } as UpdateNewsInput;

      // Mock the select query to check existing published_at
      (supabase.from as jest.Mock)
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValueOnce({
            data: { published_at: null },
            error: null,
          }),
        })
        .mockReturnValueOnce({
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValueOnce({
            data: { ...mockNew, status: 'published' },
            error: null,
          }),
        });

      const result = await newsService.updateNews(input);

      expect(result.status).toBe('published');
    });

    it('should update news without changing published_at when already published', async () => {
      const mockNew = mockNews[0];
      const publishedAt = new Date().toISOString();
      const input = {
        id: mockNew.id,
        status: 'published',
      } as UpdateNewsInput;

      // Mock the select query to check existing published_at
      (supabase.from as jest.Mock)
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValueOnce({
            data: { published_at: publishedAt },
            error: null,
          }),
        })
        .mockReturnValueOnce({
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValueOnce({
            data: {
              ...mockNew,
              status: 'published',
              published_at: publishedAt,
            },
            error: null,
          }),
        });

      const result = await newsService.updateNews(input);

      expect(result.status).toBe('published');
    });

    it('should handle error when checking published_at', async () => {
      const mockNew = mockNews[0];
      const input = {
        id: mockNew.id,
        status: 'published',
      } as UpdateNewsInput;

      // Mock the select query to return error
      (supabase.from as jest.Mock)
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValueOnce({
            data: null,
            error: null,
          }),
        })
        .mockReturnValueOnce({
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValueOnce({
            data: { ...mockNew, status: 'published' },
            error: null,
          }),
        });

      const result = await newsService.updateNews(input);

      expect(result.status).toBe('published');
    });

    it('should throw error if updating news fails', async () => {
      const mockError = new Error('Failed to update news');
      const input = {
        id: 'news-id',
        title: 'Updated Title',
      } as UpdateNewsInput;

      (supabase.from as jest.Mock).mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({
          data: null,
          error: mockError,
        }),
      });

      await expect(newsService.updateNews(input)).rejects.toThrow(mockError);
    });
  });

  describe('deleteNews', () => {
    it('should delete a news', async () => {
      const mockNewId = mockNews[0].id;
      const mockResponse = { error: null };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      await newsService.deleteNews(mockNewId);

      expect(supabase.from).toHaveBeenCalledWith('news');
    });

    it('should throw error if deleting news fails', async () => {
      const mockError = new Error('Failed to delete news');

      (supabase.from as jest.Mock).mockReturnValueOnce({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValueOnce({
          error: mockError,
        }),
      });

      await expect(newsService.deleteNews('news-id')).rejects.toThrow(
        mockError,
      );
    });
  });

  describe('incrementViewCount', () => {
    it('should increment the view count of a news', async () => {
      const mockNewId = mockNews[0].id;
      const mockResponse = { error: null };

      (supabase.rpc as jest.Mock).mockResolvedValueOnce(mockResponse);

      await newsService.incrementViewCount(mockNewId);

      expect(supabase.rpc).toHaveBeenCalledWith('increment_counter', {
        table_name: 'news',
        column_name: 'views_count',
        row_id: mockNewId,
        amount: 1,
      });
    });

    it('should throw error if incrementing view count fails', async () => {
      const mockError = new Error('Failed to increment view count');

      (supabase.rpc as jest.Mock).mockResolvedValueOnce({
        error: mockError,
      });

      await expect(newsService.incrementViewCount('news-id')).rejects.toThrow(
        mockError,
      );
    });
  });

  describe('getTrendingNews', () => {
    it('should fetch trending news with default limit', async () => {
      const mockNewsData = mockNews.slice(0, 10);
      const mockResponse = { data: mockNewsData, error: null };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getTrendingNews();

      expect(supabase.from).toHaveBeenCalledWith('news');
      expect(result).toEqual(mockNewsData);
    });

    it('should fetch trending news with custom limit', async () => {
      const mockNewsData = mockNews.slice(0, 3);
      const mockResponse = { data: mockNewsData, error: null };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getTrendingNews(3);

      expect(supabase.from).toHaveBeenCalledWith('news');
      expect(result).toEqual(mockNewsData);
    });

    it('should return empty array if no trending news found', async () => {
      const mockResponse = { data: null, error: null };

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getTrendingNews();

      expect(result).toEqual([]);
    });

    it('should throw error if fetching trending news fails', async () => {
      const mockError = new Error('Failed to fetch trending news');

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce({
          data: null,
          error: mockError,
        }),
      });

      await expect(newsService.getTrendingNews()).rejects.toThrow(mockError);
    });
  });
});
