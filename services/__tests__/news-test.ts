import { mockNews } from '@/mocks';
import { newsService, supabase } from '@/services';

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
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'user-id',
            },
          },
        },
      }),
    },
  },
}));

describe('newsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getNews', () => {
    it('should fetch news with correct filters and pagination', async () => {
      const mockNewsData = mockNews.slice(0, 5);
      const mockResponse = {
        data: mockNewsData,
        error: null,
        count: mockNewsData.length,
      };

      (supabase.from('news').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getNews({}, { page: 1, limit: 5 });

      expect(supabase.from).toHaveBeenCalledWith('news');
      expect(result.data).toEqual(mockNewsData);
      expect(result.count).toBe(mockNewsData.length);
    });
  });

  describe('getNewsById', () => {
    it('should fetch a single news by id', async () => {
      const mockNew = mockNews[0];
      const mockResponse = { data: mockNew, error: null };

      (supabase.from('news').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getNewsById(mockNew.id);

      expect(supabase.from).toHaveBeenCalledWith('news');
      expect(result).toEqual(mockNew);
    });
  });

  describe('createNews', () => {
    it('should create a new news', async () => {
      const mockNew = mockNews[0];
      const input = {
        title: mockNew.title,
        content: mockNew.content,
        image_url: mockNew.imageUrl,
        category_id: mockNew.categoryId,
        status: mockNew.status,
      };
      const mockResponse = { data: mockNew, error: null };

      (supabase.from('news').insert as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.createNews(input);

      expect(supabase.from).toHaveBeenCalledWith('news');
      expect(result).toEqual(mockNew);
    });
  });

  describe('updateNews', () => {
    it('should update a news', async () => {
      const mockNew = mockNews[0];
      const input = {
        id: mockNew.id,
        title: 'Updated Title',
      };
      const mockResponse = {
        data: {
          ...mockNew,
          title: 'Updated Title',
          updatedAt: new Date().toISOString(),
        },
        error: null,
      };

      (supabase.from('news').update as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.updateNews(input);

      expect(supabase.from).toHaveBeenCalledWith('news');
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('deleteNews', () => {
    it('should delete a news', async () => {
      const mockNewId = mockNews[0].id;
      const mockResponse = { error: null };

      (supabase.from('news').delete as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      await newsService.deleteNews(mockNewId);

      expect(supabase.from).toHaveBeenCalledWith('news');
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
  });

  describe('getTrendingNews', () => {
    it('should fetch trending news', async () => {
      const mockNewsData = mockNews.slice(0, 3);
      const mockResponse = { data: mockNewsData, error: null };

      (supabase.from('news').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await newsService.getTrendingNews(3);

      expect(supabase.from).toHaveBeenCalledWith('news');
      expect(result).toEqual(mockNewsData);
    });
  });
});
