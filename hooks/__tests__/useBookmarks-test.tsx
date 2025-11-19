import { bookmarkService } from '@/services';
import { useAuthStore } from '@/stores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import {
  BOOKMARK_QUERY_KEYS,
  useBookmarks,
  useInfiniteBookmarks,
  useIsBookmarked,
  useToggleBookmark,
} from '../useBookmarks';
import { NEWS_QUERY_KEYS } from '../useNews';

jest.mock('@/services');
jest.mock('@/stores');

// Global cleanup for all timers
afterAll(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity, // Keep data in cache for tests
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return {
    queryClient,
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  };
};

describe('useBookmarks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (queryClient) {
      queryClient.clear();
    }
  });

  it('should return a list of bookmarks', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.getBookmarks as jest.Mock).mockResolvedValue({
      data: [{ id: '1' }],
      totalPages: 1,
    });

    const { result } = renderHook(() => useBookmarks(), { wrapper });

    await waitFor(() => {
      expect(result.current.data?.data[0].id).toBe('1');
    });
  });

  it('should not fetch bookmarks if user is not authenticated', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
    });

    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(bookmarkService.getBookmarks).not.toHaveBeenCalled();
  });

  it('should accept custom pagination params', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.getBookmarks as jest.Mock).mockResolvedValue({
      data: [{ id: '1' }, { id: '2' }],
      page: 2,
      limit: 20,
      totalPages: 3,
    });

    const { result } = renderHook(() => useBookmarks({ page: 2, limit: 20 }), {
      wrapper,
    });

    await waitFor(() => {
      expect(bookmarkService.getBookmarks).toHaveBeenCalledWith('1', {
        page: 2,
        limit: 20,
      });
    });
  });
});

describe('useInfiniteBookmarks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (queryClient) {
      queryClient.clear();
    }
  });

  it('should return a list of bookmarks', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.getBookmarks as jest.Mock).mockResolvedValue({
      data: [{ id: '1' }],
      page: 1,
      totalPages: 1,
    });

    const { result } = renderHook(() => useInfiniteBookmarks(), { wrapper });

    await waitFor(() => {
      expect(result.current.data?.pages[0].data[0].id).toBe('1');
    });
  });

  it('should fetch the next page', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.getBookmarks as jest.Mock)
      .mockResolvedValueOnce({
        data: [{ id: '1' }],
        page: 1,
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        data: [{ id: '2' }],
        page: 2,
        totalPages: 2,
      });

    const { result } = renderHook(() => useInfiniteBookmarks(), { wrapper });

    await waitFor(() => {
      expect(result.current.data?.pages.length).toBe(1);
    });

    act(() => {
      result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.data?.pages.length).toBe(2);
    });
  });

  it('should return undefined for next page when on last page', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.getBookmarks as jest.Mock).mockResolvedValue({
      data: [{ id: '1' }],
      page: 2,
      totalPages: 2,
    });

    const { result } = renderHook(() => useInfiniteBookmarks(), { wrapper });

    await waitFor(() => {
      expect(result.current.data?.pages[0].page).toBe(2);
    });

    // Since page === totalPages, hasNextPage should be false
    expect(result.current.hasNextPage).toBe(false);
  });

  it('should not fetch bookmarks if user is not authenticated', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
    });

    const { result } = renderHook(() => useInfiniteBookmarks(), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(bookmarkService.getBookmarks).not.toHaveBeenCalled();
  });

  it('should accept custom limit', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.getBookmarks as jest.Mock).mockResolvedValue({
      data: [{ id: '1' }],
      page: 1,
      totalPages: 1,
    });

    renderHook(() => useInfiniteBookmarks(25), { wrapper });

    await waitFor(() => {
      expect(bookmarkService.getBookmarks).toHaveBeenCalledWith('1', {
        page: 1,
        limit: 25,
      });
    });
  });
});

describe('useIsBookmarked', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (queryClient) {
      queryClient.clear();
    }
  });

  it('should return true if the news is bookmarked', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.isBookmarked as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useIsBookmarked('1'), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toBe(true);
    });
  });

  it('should return false if the news is not bookmarked', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.isBookmarked as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useIsBookmarked('1'), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toBe(false);
    });
  });

  it('should not check if user is not authenticated', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
    });

    const { result } = renderHook(() => useIsBookmarked('1'), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(bookmarkService.isBookmarked).not.toHaveBeenCalled();
  });

  it('should not check if newsId is empty', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });

    const { result } = renderHook(() => useIsBookmarked(''), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(bookmarkService.isBookmarked).not.toHaveBeenCalled();
  });
});

describe('useToggleBookmark', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (queryClient) {
      queryClient.clear();
    }
  });

  it('should toggle the bookmark status', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    await waitFor(() => {
      expect(bookmarkService.toggleBookmark).toHaveBeenCalledWith(
        '1',
        'news-1',
      );
    });
  });

  it('should optimistically update bookmark check status', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });

    // Use a promise we can control to delay mutation completion
    let resolveMutation: () => void;
    const mutationPromise = new Promise<void>(resolve => {
      resolveMutation = resolve;
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockReturnValue(
      mutationPromise,
    );

    // Set initial bookmark status
    qc.setQueryData(BOOKMARK_QUERY_KEYS.check('news-1'), true);

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    // Check optimistic update before mutation completes
    await waitFor(() => {
      const bookmarkStatus = qc.getQueryData(
        BOOKMARK_QUERY_KEYS.check('news-1'),
      );
      expect(bookmarkStatus).toBe(false);
    });

    // Now complete the mutation
    act(() => {
      resolveMutation!();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should optimistically update news detail when bookmarked', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockResolvedValue(undefined);

    // Set initial news detail
    qc.setQueryData(NEWS_QUERY_KEYS.detail('news-1'), {
      id: 'news-1',
      title: 'Test News',
      isBookmarked: true,
      bookmarksCount: 5,
    });

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    await waitFor(() => {
      const newsDetail = qc.getQueryData(NEWS_QUERY_KEYS.detail('news-1'));
      expect(newsDetail).toMatchObject({
        id: 'news-1',
        isBookmarked: false,
        bookmarksCount: 4,
      });
    });
  });

  it('should optimistically update news detail when not bookmarked', async () => {
    const { wrapper, queryClient } = createWrapper();

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockResolvedValue(undefined);

    // Set initial news detail
    queryClient.setQueryData(NEWS_QUERY_KEYS.detail('news-1'), {
      id: 'news-1',
      title: 'Test News',
      isBookmarked: false,
      bookmarksCount: 5,
    });

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    await waitFor(() => {
      const newsDetail = queryClient.getQueryData(
        NEWS_QUERY_KEYS.detail('news-1'),
      );
      expect(newsDetail).toMatchObject({
        id: 'news-1',
        isBookmarked: true,
        bookmarksCount: 6,
      });
    });
  });

  it('should not update news detail if id does not match', async () => {
    const { wrapper, queryClient } = createWrapper();

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockResolvedValue(undefined);

    // Set initial news detail with different id
    const initialNewsDetail = {
      id: 'news-2',
      title: 'Other News',
      isBookmarked: false,
      bookmarksCount: 3,
    };
    queryClient.setQueryData(
      NEWS_QUERY_KEYS.detail('news-2'),
      initialNewsDetail,
    );

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const newsDetail = queryClient.getQueryData(
      NEWS_QUERY_KEYS.detail('news-2'),
    );
    expect(newsDetail).toEqual(initialNewsDetail);
  });

  it('should optimistically update infinite news lists when bookmarked', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });

    // Use a promise we can control
    let resolveMutation: () => void;
    const mutationPromise = new Promise<void>(resolve => {
      resolveMutation = resolve;
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockReturnValue(
      mutationPromise,
    );

    // Set initial infinite news list with proper filters
    const filters = {};
    qc.setQueryData(NEWS_QUERY_KEYS.infiniteList(filters), {
      pages: [
        {
          data: [
            {
              id: 'news-1',
              title: 'Test News',
              isBookmarked: true,
              bookmarksCount: 5,
            },
          ],
          count: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      ],
      pageParams: [1],
    });

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    // Check optimistic update before mutation completes
    await waitFor(() => {
      const infiniteList = qc.getQueryData(
        NEWS_QUERY_KEYS.infiniteList(filters),
      );
      expect(infiniteList).toMatchObject({
        pages: [
          {
            data: [
              {
                id: 'news-1',
                isBookmarked: false,
                bookmarksCount: 4,
              },
            ],
          },
        ],
      });
    });

    // Complete the mutation
    act(() => {
      resolveMutation!();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should optimistically update infinite news lists when not bookmarked', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });

    // Use a promise we can control
    let resolveMutation: () => void;
    const mutationPromise = new Promise<void>(resolve => {
      resolveMutation = resolve;
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockReturnValue(
      mutationPromise,
    );

    // Set initial infinite news list with proper filters
    const filters = {};
    qc.setQueryData(NEWS_QUERY_KEYS.infiniteList(filters), {
      pages: [
        {
          data: [
            {
              id: 'news-1',
              title: 'Test News',
              isBookmarked: false,
              bookmarksCount: 5,
            },
          ],
          count: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      ],
      pageParams: [1],
    });

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    // Check optimistic update before mutation completes
    await waitFor(() => {
      const infiniteList = qc.getQueryData(
        NEWS_QUERY_KEYS.infiniteList(filters),
      );
      expect(infiniteList).toMatchObject({
        pages: [
          {
            data: [
              {
                id: 'news-1',
                isBookmarked: true,
                bookmarksCount: 6,
              },
            ],
          },
        ],
      });
    });

    // Complete the mutation
    act(() => {
      resolveMutation!();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should handle infinite list with no data', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockResolvedValue(undefined);

    // Set initial state with null data - don't set anything, leaving it undefined
    const filters = {};
    // Don't set query data, leave it undefined

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const infiniteList = qc.getQueryData(NEWS_QUERY_KEYS.infiniteList(filters));
    // Since we never set it, it should be undefined (not null)
    expect(infiniteList).toBeUndefined();
  });

  it('should optimistically update regular news lists when bookmarked', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });

    // Use a promise we can control
    let resolveMutation: () => void;
    const mutationPromise = new Promise<void>(resolve => {
      resolveMutation = resolve;
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockReturnValue(
      mutationPromise,
    );

    // Set initial regular news list with proper filters
    const filters = {};
    qc.setQueryData(NEWS_QUERY_KEYS.list(filters), {
      data: [
        {
          id: 'news-1',
          title: 'Test News',
          isBookmarked: true,
          bookmarksCount: 5,
        },
      ],
      count: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    // Check optimistic update before mutation completes
    await waitFor(() => {
      const newsList = qc.getQueryData(NEWS_QUERY_KEYS.list(filters));
      expect(newsList).toMatchObject({
        data: [
          {
            id: 'news-1',
            isBookmarked: false,
            bookmarksCount: 4,
          },
        ],
      });
    });

    // Complete the mutation
    act(() => {
      resolveMutation!();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should optimistically update regular news lists when not bookmarked', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });

    // Use a promise we can control
    let resolveMutation: () => void;
    const mutationPromise = new Promise<void>(resolve => {
      resolveMutation = resolve;
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockReturnValue(
      mutationPromise,
    );

    // Set initial regular news list with proper filters
    const filters = {};
    qc.setQueryData(NEWS_QUERY_KEYS.list(filters), {
      data: [
        {
          id: 'news-1',
          title: 'Test News',
          isBookmarked: false,
          bookmarksCount: 5,
        },
      ],
      count: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    // Check optimistic update before mutation completes
    await waitFor(() => {
      const newsList = qc.getQueryData(NEWS_QUERY_KEYS.list(filters));
      expect(newsList).toMatchObject({
        data: [
          {
            id: 'news-1',
            isBookmarked: true,
            bookmarksCount: 6,
          },
        ],
      });
    });

    // Complete the mutation
    act(() => {
      resolveMutation!();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should handle regular list with no data', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockResolvedValue(undefined);

    // Don't set query data, leave it undefined
    const filters = {};

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const newsList = qc.getQueryData(NEWS_QUERY_KEYS.list(filters));
    expect(newsList).toBeUndefined();
  });

  it('should handle errors and rollback optimistic updates', async () => {
    const mockError = new Error('Error toggling bookmark');
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });

    // Use a promise we can control
    let rejectMutation: (error: Error) => void;
    const mutationPromise = new Promise<void>((_, reject) => {
      rejectMutation = reject;
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockReturnValue(
      mutationPromise,
    );

    // Set initial bookmark status
    qc.setQueryData(BOOKMARK_QUERY_KEYS.check('news-1'), true);

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    // First check the optimistic update happened
    await waitFor(() => {
      const bookmarkStatus = qc.getQueryData(
        BOOKMARK_QUERY_KEYS.check('news-1'),
      );
      expect(bookmarkStatus).toBe(false);
    });

    // Now trigger the error
    act(() => {
      rejectMutation!(mockError);
    });

    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
    });

    // Check that the status was rolled back
    await waitFor(() => {
      const bookmarkStatus = qc.getQueryData(
        BOOKMARK_QUERY_KEYS.check('news-1'),
      );
      expect(bookmarkStatus).toBe(true);
    });
  });

  it('should not rollback if previousIsBookmarked is undefined', async () => {
    const mockError = new Error('Error toggling bookmark');
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });

    // Use a promise we can control
    let rejectMutation: (error: Error) => void;
    const mutationPromise = new Promise<void>((_, reject) => {
      rejectMutation = reject;
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockReturnValue(
      mutationPromise,
    );

    // Don't set initial bookmark status
    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    // First check the optimistic update happened
    await waitFor(() => {
      const bookmarkStatus = qc.getQueryData(
        BOOKMARK_QUERY_KEYS.check('news-1'),
      );
      expect(bookmarkStatus).toBe(true);
    });

    // Now trigger the error
    act(() => {
      rejectMutation!(mockError);
    });

    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
    });

    // The bookmark status should remain as set during optimistic update (not rolled back)
    const bookmarkStatus = qc.getQueryData(BOOKMARK_QUERY_KEYS.check('news-1'));
    expect(bookmarkStatus).toBe(true);
  });

  it('should invalidate all related queries on success', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockResolvedValue(undefined);

    const invalidateSpy = jest.spyOn(qc, 'invalidateQueries');

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Check that all queries were invalidated
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: BOOKMARK_QUERY_KEYS.check('news-1'),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: BOOKMARK_QUERY_KEYS.lists(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: BOOKMARK_QUERY_KEYS.infiniteList('1'),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: NEWS_QUERY_KEYS.detail('news-1'),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: NEWS_QUERY_KEYS.lists(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: NEWS_QUERY_KEYS.infiniteLists(),
    });
  });

  it('should ensure bookmarksCount does not go below 0', async () => {
    const { wrapper, queryClient: qc } = createWrapper();
    queryClient = qc;

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1' },
    });

    // Use a promise we can control
    let resolveMutation: () => void;
    const mutationPromise = new Promise<void>(resolve => {
      resolveMutation = resolve;
    });
    (bookmarkService.toggleBookmark as jest.Mock).mockReturnValue(
      mutationPromise,
    );

    // Set news with 0 bookmarks
    qc.setQueryData(NEWS_QUERY_KEYS.detail('news-1'), {
      id: 'news-1',
      title: 'Test News',
      isBookmarked: true,
      bookmarksCount: 0,
    });

    const { result } = renderHook(() => useToggleBookmark(), { wrapper });

    act(() => {
      result.current.mutate('news-1');
    });

    // Check optimistic update before mutation completes
    await waitFor(() => {
      const newsDetail = qc.getQueryData(NEWS_QUERY_KEYS.detail('news-1'));
      expect(newsDetail).toMatchObject({
        id: 'news-1',
        isBookmarked: false,
        bookmarksCount: 0, // Should not go below 0
      });
    });

    // Complete the mutation
    act(() => {
      resolveMutation!();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
