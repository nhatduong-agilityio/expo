import {
  useCategories,
  useIsSubscribed,
  useSubscribedTopics,
  useToggleSubscription,
} from '@/hooks/useCategories';
import { mockCategories, mockTopicSubscriptions } from '@/mocks/';
import { categoryService } from '@/services';
import { useAuthStore } from '@/stores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';

jest.mock('@/services');
jest.mock('@/stores');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCategories hooks', () => {
  const user = { id: '1' };

  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ user });
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('useCategories', () => {
    it('should fetch all categories', async () => {
      (categoryService.getCategories as jest.Mock).mockResolvedValue(
        mockCategories,
      );

      const { result } = renderHook(() => useCategories(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(categoryService.getCategories).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockCategories);
    });
  });

  describe('useSubscribedTopics', () => {
    it('should fetch subscribed topics for a user', async () => {
      (categoryService.getSubscribedTopics as jest.Mock).mockResolvedValue(
        mockTopicSubscriptions,
      );

      const { result } = renderHook(() => useSubscribedTopics(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(categoryService.getSubscribedTopics).toHaveBeenCalledWith(user.id);
      expect(result.current.data).toEqual(mockTopicSubscriptions);
    });
  });

  describe('useIsSubscribed', () => {
    it('should check if a user is subscribed to a category', async () => {
      (categoryService.isSubscribed as jest.Mock).mockResolvedValue(true);
      const categoryId = mockCategories[0].id;

      const { result } = renderHook(() => useIsSubscribed(categoryId), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(categoryService.isSubscribed).toHaveBeenCalledWith(
        user.id,
        categoryId,
      );
      expect(result.current.data).toBe(true);
    });
  });

  describe('useToggleSubscription', () => {
    it('should toggle a subscription and perform optimistic update', async () => {
      const categoryId = mockCategories[0].id;
      (categoryService.toggleSubscription as jest.Mock).mockResolvedValue(
        undefined,
      );
      queryClient.setQueryData(['categories', 'check', categoryId], false);
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useToggleSubscription(), { wrapper });

      result.current.mutate(categoryId);

      await waitFor(() => {
        // Check optimistic update
        expect(
          queryClient.getQueryData(['categories', 'check', categoryId]),
        ).toBe(true);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(categoryService.toggleSubscription).toHaveBeenCalledWith(
        user.id,
        categoryId,
      );
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['categories', 'check', categoryId],
      });
    });
  });
});
