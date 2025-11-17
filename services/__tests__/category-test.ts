import { mockCategories } from '@/mocks';
import { categoryService, supabase } from '@/services';

jest.mock('@/services/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  },
}));

const mockTopicSubscriptions = [
  {
    id: '1',
    userId: 'user-id',
    categoryId: mockCategories[0].id,
    createdAt: new Date().toISOString(),
    category: mockCategories[0],
  },
  {
    id: '2',
    userId: 'user-id',
    categoryId: mockCategories[1].id,
    createdAt: new Date().toISOString(),
    category: mockCategories[1],
  },
];

describe('categoryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should fetch categories', async () => {
      const mockResponse = { data: mockCategories, error: null };
      (supabase.from('categories').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await categoryService.getCategories();

      expect(supabase.from).toHaveBeenCalledWith('categories');
      expect(result).toEqual(mockCategories);
    });
  });

  describe('getCategoryBySlug', () => {
    it('should fetch a single category by slug', async () => {
      const mockResponse = { data: mockCategories[0], error: null };
      (supabase.from('categories').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await categoryService.getCategoryBySlug(
        mockCategories[0].slug,
      );

      expect(supabase.from).toHaveBeenCalledWith('categories');
      expect(result).toEqual(mockCategories[0]);
    });
  });

  describe('getSubscribedTopics', () => {
    it('should fetch user subscribed topics', async () => {
      const mockResponse = { data: mockTopicSubscriptions, error: null };
      (
        supabase.from('topic_subscriptions').select as jest.Mock
      ).mockReturnValueOnce({
        eq: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await categoryService.getSubscribedTopics('user-id');

      expect(supabase.from).toHaveBeenCalledWith('topic_subscriptions');
      expect(result).toEqual(mockTopicSubscriptions);
    });
  });

  describe('isSubscribed', () => {
    it('should return true if user is subscribed to a topic', async () => {
      (
        supabase.from('topic_subscriptions').select as jest.Mock
      ).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValueOnce({ data: { id: '1' }, error: null }),
      });

      const result = await categoryService.isSubscribed(
        'user-id',
        mockCategories[0].id,
      );
      expect(result).toBe(true);
    });

    it('should return false if user is not subscribed to a topic', async () => {
      (
        supabase.from('topic_subscriptions').select as jest.Mock
      ).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValueOnce({ data: null, error: null }),
      });

      const result = await categoryService.isSubscribed(
        'user-id',
        'non-existent-id',
      );
      expect(result).toBe(false);
    });
  });

  describe('subscribeTopic', () => {
    it('should subscribe a user to a topic', async () => {
      const mockResponse = { data: mockTopicSubscriptions[0], error: null };
      (
        supabase.from('topic_subscriptions').insert as jest.Mock
      ).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await categoryService.subscribeTopic(
        'user-id',
        mockCategories[0].id,
      );
      expect(result).toEqual(mockTopicSubscriptions[0]);
    });
  });

  describe('unsubscribeTopic', () => {
    it('should unsubscribe a user from a topic', async () => {
      (
        supabase.from('topic_subscriptions').delete as jest.Mock
      ).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
      });

      await categoryService.unsubscribeTopic('user-id', mockCategories[0].id);
      expect(supabase.from).toHaveBeenCalledWith('topic_subscriptions');
    });
  });

  describe('toggleSubscription', () => {
    it('should subscribe a user if not already subscribed', async () => {
      jest.spyOn(categoryService, 'isSubscribed').mockResolvedValueOnce(false);
      jest
        .spyOn(categoryService, 'subscribeTopic')
        .mockResolvedValueOnce(mockTopicSubscriptions[0]);

      const result = await categoryService.toggleSubscription(
        'user-id',
        mockCategories[0].id,
      );
      expect(result).toEqual({ subscribed: true });
      expect(categoryService.subscribeTopic).toHaveBeenCalledWith(
        'user-id',
        mockCategories[0].id,
      );
    });

    it('should unsubscribe a user if already subscribed', async () => {
      jest.spyOn(categoryService, 'isSubscribed').mockResolvedValueOnce(true);
      jest.spyOn(categoryService, 'unsubscribeTopic').mockResolvedValueOnce();

      const result = await categoryService.toggleSubscription(
        'user-id',
        mockCategories[0].id,
      );
      expect(result).toEqual({ subscribed: false });
      expect(categoryService.unsubscribeTopic).toHaveBeenCalledWith(
        'user-id',
        mockCategories[0].id,
      );
    });
  });
});
