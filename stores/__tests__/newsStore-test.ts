import { mockNews } from '@/mocks';
import { useNewsStore } from '@/stores';

describe('newsStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useNewsStore.setState({
      news: [],
      selectedNews: null,
      filters: {},
      isLoading: false,
      error: null,
    });
  });

  it('should have initial state', () => {
    const state = useNewsStore.getState();
    expect(state.news).toEqual([]);
    expect(state.selectedNews).toBeNull();
    expect(state.filters).toEqual({});
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set news', () => {
    useNewsStore.getState().setNews(mockNews);
    const state = useNewsStore.getState();
    expect(state.news).toEqual(mockNews);
  });

  it('should set selected news', () => {
    useNewsStore.getState().setSelectedNews(mockNews[0]);
    const state = useNewsStore.getState();
    expect(state.selectedNews?.content).toEqual(mockNews[0].content);
  });

  it('should set filters', () => {
    const filters = { category: 'technology', search: 'test' };
    useNewsStore.getState().setFilters(filters);
    const state = useNewsStore.getState();
    expect(state.filters).toEqual(filters);
  });

  it('should set loading state', () => {
    useNewsStore.getState().setLoading(true);
    expect(useNewsStore.getState().isLoading).toBe(true);

    useNewsStore.getState().setLoading(false);
    expect(useNewsStore.getState().isLoading).toBe(false);
  });

  it('should set error', () => {
    useNewsStore.getState().setError('Test error');
    expect(useNewsStore.getState().error).toBe('Test error');
  });

  it('should clear filters', () => {
    useNewsStore.getState().setFilters({ category: 'technology' });
    useNewsStore.getState().clearFilters();
    expect(useNewsStore.getState().filters).toEqual({});
  });
});
