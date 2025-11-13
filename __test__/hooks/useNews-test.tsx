import {
  useCreateNews,
  useDeleteNews,
  useIncrementViewCount,
  useInfiniteNews,
  useNews,
  useNewsDetail,
  useTrendingNews,
  useUpdateNews,
} from '@/hooks/useNews';
import { mockNews } from '@/mocks/data';
import { newsService } from '@/services';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';

jest.mock('@/services');

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

describe('useNews hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('useNews', () => {
    it('should fetch news', async () => {
      (newsService.getNews as jest.Mock).mockResolvedValue({
        data: mockNews,
        count: mockNews.length,
      });

      const { result } = renderHook(() => useNews(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.data).toEqual(mockNews);
    });
  });

  describe('useInfiniteNews', () => {
    it('should fetch infinite news', async () => {
      (newsService.getNews as jest.Mock).mockResolvedValue({
        data: mockNews,
        count: mockNews.length,
        totalPages: 2,
        page: 1,
      });

      const { result } = renderHook(() => useInfiniteNews(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.pages[0].data).toEqual(mockNews);
    });
  });

  describe('useNewsDetail', () => {
    it('should fetch news detail', async () => {
      (newsService.getNewsById as jest.Mock).mockResolvedValue(mockNews[0]);

      const { result } = renderHook(() => useNewsDetail(mockNews[0].id), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockNews[0]);
    });
  });

  describe('useTrendingNews', () => {
    it('should fetch trending news', async () => {
      (newsService.getTrendingNews as jest.Mock).mockResolvedValue(mockNews);

      const { result } = renderHook(() => useTrendingNews(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockNews);
    });
  });

  describe('useCreateNews', () => {
    it('should create news', async () => {
      (newsService.createNews as jest.Mock).mockResolvedValue(mockNews[0]);
      const { result } = renderHook(() => useCreateNews(), { wrapper });

      result.current.mutate({} as any);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(newsService.createNews).toHaveBeenCalled();
    });
  });

  describe('useUpdateNews', () => {
    it('should update news', async () => {
      (newsService.updateNews as jest.Mock).mockResolvedValue(mockNews[0]);
      const { result } = renderHook(() => useUpdateNews(), { wrapper });

      result.current.mutate({ id: mockNews[0].id });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(newsService.updateNews).toHaveBeenCalled();
    });
  });

  describe('useDeleteNews', () => {
    it('should delete news', async () => {
      (newsService.deleteNews as jest.Mock).mockResolvedValue(undefined);
      const { result } = renderHook(() => useDeleteNews(), { wrapper });

      result.current.mutate(mockNews[0].id);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(newsService.deleteNews).toHaveBeenCalled();
    });
  });

  describe('useIncrementViewCount', () => {
    it('should increment view count', async () => {
      (newsService.incrementViewCount as jest.Mock).mockResolvedValue(
        undefined,
      );
      const { result } = renderHook(() => useIncrementViewCount(), { wrapper });

      result.current.mutate(mockNews[0].id);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(newsService.incrementViewCount).toHaveBeenCalled();
    });
  });
});
