import { mockNews } from '@/mocks';
import { likeService, supabase } from '@/services';

jest.mock('@/services/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  },
}));

const mockLike = {
  id: '1',
  userId: 'user-id',
  newsId: mockNews[0].id,
  createdAt: new Date().toISOString(),
};

describe('likeService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isLiked', () => {
    it('should return true if news is liked', async () => {
      (supabase.from('likes').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValueOnce({ data: { id: '1' }, error: null }),
      });

      const result = await likeService.isLiked('user-id', mockNews[0].id);
      expect(result).toBe(true);
    });

    it('should return false if news is not liked', async () => {
      (supabase.from('likes').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValueOnce({ data: null, error: null }),
      });

      const result = await likeService.isLiked('user-id', 'non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('addLike', () => {
    it('should add a like', async () => {
      const mockResponse = { data: mockLike, error: null };
      (supabase.from('likes').insert as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await likeService.addLike('user-id', mockNews[0].id);
      expect(result).toEqual(mockLike);
    });
  });

  describe('removeLike', () => {
    it('should remove a like', async () => {
      (supabase.from('likes').delete as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
      });

      await likeService.removeLike('user-id', mockNews[0].id);
      expect(supabase.from).toHaveBeenCalledWith('likes');
    });
  });

  describe('toggleLike', () => {
    it('should add a like if not already liked', async () => {
      jest.spyOn(likeService, 'isLiked').mockResolvedValueOnce(false);
      jest.spyOn(likeService, 'addLike').mockResolvedValueOnce(mockLike);

      const result = await likeService.toggleLike('user-id', mockNews[0].id);
      expect(result).toEqual({ liked: true });
      expect(likeService.addLike).toHaveBeenCalledWith(
        'user-id',
        mockNews[0].id,
      );
    });

    it('should remove a like if already liked', async () => {
      jest.spyOn(likeService, 'isLiked').mockResolvedValueOnce(true);
      jest.spyOn(likeService, 'removeLike').mockResolvedValueOnce();

      const result = await likeService.toggleLike('user-id', mockNews[0].id);
      expect(result).toEqual({ liked: false });
      expect(likeService.removeLike).toHaveBeenCalledWith(
        'user-id',
        mockNews[0].id,
      );
    });
  });
});
