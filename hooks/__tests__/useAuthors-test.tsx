import { authService } from '@/services';
import { useAuthStore } from '@/stores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useInfiniteAuthors } from '../useAuthors';

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

describe('useInfiniteAuthors', () => {
  it('should return a list of authors', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (authService.searchAuthors as jest.Mock).mockResolvedValue({
      data: [{ id: '1', name: 'Author 1' }],
      totalPages: 1,
    });

    const { result } = renderHook(() => useInfiniteAuthors('query'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data?.pages[0].data[0].name).toBe('Author 1');
    });
  });

  it('should return the next page param', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (authService.searchAuthors as jest.Mock)
      .mockResolvedValueOnce({
        data: [{ id: '1', name: 'Author 1' }],
        page: 1,
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        data: [{ id: '2', name: 'Author 2' }],
        page: 2,
        totalPages: 2,
      });

    const { result } = renderHook(() => useInfiniteAuthors('query'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data?.pages.length).toBe(1);
    });

    result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages.length).toBe(2);
    });
  });
});
