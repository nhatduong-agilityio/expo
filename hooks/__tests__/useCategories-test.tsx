import { categoryService } from '@/services';
import { useAuthStore } from '@/stores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import {
  useCategories,
  useIsSubscribed,
  useSubscribedTopics,
  useToggleSubscription,
} from '../useCategories';

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

describe('useCategories', () => {
  it('should return a list of categories', async () => {
    (categoryService.getCategories as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Category 1' },
    ]);

    const { result } = renderHook(() => useCategories(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data?.[0].name).toBe('Category 1');
    });
  });
});

describe('useSubscribedTopics', () => {
  it('should return a list of subscribed topics', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (categoryService.getSubscribedTopics as jest.Mock).mockResolvedValue([
      { id: '1' },
    ]);

    const { result } = renderHook(() => useSubscribedTopics(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data?.[0].id).toBe('1');
    });
  });
});

describe('useIsSubscribed', () => {
  it('should return true if the user is subscribed', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (categoryService.isSubscribed as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useIsSubscribed('1'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toBe(true);
    });
  });
});

describe('useToggleSubscription', () => {
  it('should toggle the subscription status', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (categoryService.toggleSubscription as jest.Mock).mockResolvedValue(
      undefined,
    );

    const { result } = renderHook(() => useToggleSubscription(), {
      wrapper,
    });

    result.current.mutate('1');

    await waitFor(() => {
      expect(categoryService.toggleSubscription).toHaveBeenCalledWith('1', '1');
    });
  });

  it('should handle errors', async () => {
    const mockError = new Error('Error toggling subscription');
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (categoryService.toggleSubscription as jest.Mock).mockRejectedValue(
      mockError,
    );

    const { result } = renderHook(() => useToggleSubscription(), {
      wrapper,
    });

    result.current.mutate('1');

    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
    });
  });
});
