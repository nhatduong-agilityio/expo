import { useBookmarkStore } from '@/stores';

describe('bookmarkStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useBookmarkStore.setState({
      bookmarkedNewsIds: new Set(),
    });
  });

  it('should have initial state', () => {
    const state = useBookmarkStore.getState();
    expect(state.bookmarkedNewsIds.size).toBe(0);
  });

  it('should add bookmark', () => {
    useBookmarkStore.getState().addBookmark('news-1');
    const state = useBookmarkStore.getState();
    expect(state.bookmarkedNewsIds.has('news-1')).toBe(true);
  });

  it('should remove bookmark', () => {
    useBookmarkStore.getState().addBookmark('news-1');
    useBookmarkStore.getState().removeBookmark('news-1');
    const state = useBookmarkStore.getState();
    expect(state.bookmarkedNewsIds.has('news-1')).toBe(false);
  });

  it('should check if bookmarked', () => {
    useBookmarkStore.getState().addBookmark('news-1');
    expect(useBookmarkStore.getState().isBookmarked('news-1')).toBe(true);
    expect(useBookmarkStore.getState().isBookmarked('news-2')).toBe(false);
  });

  it('should set bookmarks', () => {
    useBookmarkStore.getState().setBookmarks(['news-1', 'news-2', 'news-3']);
    const state = useBookmarkStore.getState();
    expect(state.bookmarkedNewsIds.size).toBe(3);
    expect(state.bookmarkedNewsIds.has('news-1')).toBe(true);
    expect(state.bookmarkedNewsIds.has('news-2')).toBe(true);
    expect(state.bookmarkedNewsIds.has('news-3')).toBe(true);
  });
});
