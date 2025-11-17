import { mockNews } from '@/mocks';
import { bookmarkService, supabase } from '@/services';

jest.mock('@/services/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  },
}));

const mockBookmarks = [
  {
    id: '1',
    userId: 'user-id',
    newsId: mockNews[0].id,
    createdAt: new Date().toISOString(),
    news: mockNews[0],
  },
  {
    id: '2',
    userId: 'user-id',
    newsId: mockNews[1].id,
    createdAt: new Date().toISOString(),
    news: mockNews[1],
  },
];

describe('bookmarkService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBookmarks', () => {
    it('should fetch user bookmarks', async () => {
      const mockResponse = {
        data: mockBookmarks,
        error: null,
        count: mockBookmarks.length,
      };
      (supabase.from('bookmarks').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await bookmarkService.getBookmarks('user-id');

      expect(supabase.from).toHaveBeenCalledWith('bookmarks');
      expect(result.data).toEqual(mockBookmarks);
      expect(result.count).toBe(mockBookmarks.length);
    });
  });

  describe('isBookmarked', () => {
    it('should return true if news is bookmarked', async () => {
      (supabase.from('bookmarks').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValueOnce({ data: { id: '1' }, error: null }),
      });

      const result = await bookmarkService.isBookmarked(
        'user-id',
        mockNews[0].id,
      );
      expect(result).toBe(true);
    });

    it('should return false if news is not bookmarked', async () => {
      (supabase.from('bookmarks').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValueOnce({ data: null, error: null }),
      });

      const result = await bookmarkService.isBookmarked(
        'user-id',
        'non-existent-id',
      );
      expect(result).toBe(false);
    });
  });

  describe('addBookmark', () => {
    it('should add a bookmark', async () => {
      const mockResponse = { data: mockBookmarks[0], error: null };
      (supabase.from('bookmarks').insert as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await bookmarkService.addBookmark(
        'user-id',
        mockNews[0].id,
      );
      expect(result).toEqual(mockBookmarks[0]);
    });
  });

  describe('removeBookmark', () => {
    it('should remove a bookmark', async () => {
      (supabase.from('bookmarks').delete as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
      });

      await bookmarkService.removeBookmark('user-id', mockNews[0].id);
      expect(supabase.from).toHaveBeenCalledWith('bookmarks');
    });
  });

  describe('toggleBookmark', () => {
    it('should add a bookmark if not already bookmarked', async () => {
      jest.spyOn(bookmarkService, 'isBookmarked').mockResolvedValueOnce(false);
      jest
        .spyOn(bookmarkService, 'addBookmark')
        .mockResolvedValueOnce(mockBookmarks[0]);

      const result = await bookmarkService.toggleBookmark(
        'user-id',
        mockNews[0].id,
      );
      expect(result).toEqual({ bookmarked: true });
      expect(bookmarkService.addBookmark).toHaveBeenCalledWith(
        'user-id',
        mockNews[0].id,
      );
    });

    it('should remove a bookmark if already bookmarked', async () => {
      jest.spyOn(bookmarkService, 'isBookmarked').mockResolvedValueOnce(true);
      jest.spyOn(bookmarkService, 'removeBookmark').mockResolvedValueOnce();

      const result = await bookmarkService.toggleBookmark(
        'user-id',
        mockNews[0].id,
      );
      expect(result).toEqual({ bookmarked: false });
      expect(bookmarkService.removeBookmark).toHaveBeenCalledWith(
        'user-id',
        mockNews[0].id,
      );
    });
  });
});
