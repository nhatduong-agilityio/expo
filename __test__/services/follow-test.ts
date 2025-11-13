import { followService } from '@/services/follow';
import { supabase } from '@/services/supabase';
import { mockAuthors } from '@/mocks/data';

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

const mockFollow = {
  id: '1',
  followerId: 'user-id',
  followingId: mockAuthors[0].id,
  createdAt: new Date().toISOString(),
};

describe('followService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isFollowing', () => {
    it('should return true if user is following another user', async () => {
      (supabase.from('follows').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValueOnce({ data: { id: '1' }, error: null }),
      });

      const result = await followService.isFollowing(
        'user-id',
        mockAuthors[0].id,
      );
      expect(result).toBe(true);
    });

    it('should return false if user is not following another user', async () => {
      (supabase.from('follows').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValueOnce({ data: null, error: null }),
      });

      const result = await followService.isFollowing(
        'user-id',
        'non-existent-id',
      );
      expect(result).toBe(false);
    });
  });

  describe('followUser', () => {
    it('should follow a user', async () => {
      const mockResponse = { data: mockFollow, error: null };
      (supabase.from('follows').insert as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await followService.followUser(
        'user-id',
        mockAuthors[0].id,
      );
      expect(result).toEqual(mockFollow);
    });
  });

  describe('unfollowUser', () => {
    it('should unfollow a user', async () => {
      (supabase.from('follows').delete as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
      });

      await followService.unfollowUser('user-id', mockAuthors[0].id);
      expect(supabase.from).toHaveBeenCalledWith('follows');
    });
  });

  describe('toggleFollow', () => {
    it('should follow a user if not already following', async () => {
      jest.spyOn(followService, 'isFollowing').mockResolvedValueOnce(false);
      jest.spyOn(followService, 'followUser').mockResolvedValueOnce(mockFollow);

      const result = await followService.toggleFollow(
        'user-id',
        mockAuthors[0].id,
      );
      expect(result).toEqual({ following: true });
      expect(followService.followUser).toHaveBeenCalledWith(
        'user-id',
        mockAuthors[0].id,
      );
    });

    it('should unfollow a user if already following', async () => {
      jest.spyOn(followService, 'isFollowing').mockResolvedValueOnce(true);
      jest.spyOn(followService, 'unfollowUser').mockResolvedValueOnce();

      const result = await followService.toggleFollow(
        'user-id',
        mockAuthors[0].id,
      );
      expect(result).toEqual({ following: false });
      expect(followService.unfollowUser).toHaveBeenCalledWith(
        'user-id',
        mockAuthors[0].id,
      );
    });
  });

  describe('getFollowers', () => {
    it('should fetch followers', async () => {
      const mockResponse = {
        data: [{ follower: mockAuthors[1] }],
        error: null,
      };
      (supabase.from('follows').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await followService.getFollowers(mockAuthors[0].id);
      expect(result).toEqual([mockAuthors[1]]);
    });
  });

  describe('getFollowing', () => {
    it('should fetch following', async () => {
      const mockResponse = {
        data: [{ following: mockAuthors[1] }],
        error: null,
      };
      (supabase.from('follows').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await followService.getFollowing('user-id');
      expect(result).toEqual([mockAuthors[1]]);
    });
  });
});
