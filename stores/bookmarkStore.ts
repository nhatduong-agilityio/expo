import { create } from 'zustand';

interface BookmarkState {
  bookmarkedNewsIds: Set<string>;
  addBookmark: (newsId: string) => void;
  removeBookmark: (newsId: string) => void;
  isBookmarked: (newsId: string) => boolean;
  setBookmarks: (newsIds: string[]) => void;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarkedNewsIds: new Set(),
  addBookmark: newsId =>
    set(state => ({
      bookmarkedNewsIds: new Set(state.bookmarkedNewsIds).add(newsId),
    })),
  removeBookmark: newsId =>
    set(state => {
      const newSet = new Set(state.bookmarkedNewsIds);
      newSet.delete(newsId);
      return { bookmarkedNewsIds: newSet };
    }),
  isBookmarked: newsId => get().bookmarkedNewsIds.has(newsId),
  setBookmarks: newsIds => set({ bookmarkedNewsIds: new Set(newsIds) }),
}));
