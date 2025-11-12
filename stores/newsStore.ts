import { News, NewsFilters } from '@/types';
import { create } from 'zustand';

interface NewsState {
  news: News[];
  selectedNews: News | null;
  filters: NewsFilters;
  isLoading: boolean;
  error: string | null;
  setNews: (news: News[]) => void;
  setSelectedNews: (news: News | null) => void;
  setFilters: (filters: NewsFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearFilters: () => void;
}

export const useNewsStore = create<NewsState>(set => ({
  news: [],
  selectedNews: null,
  filters: {},
  isLoading: false,
  error: null,
  setNews: news => set({ news }),
  setSelectedNews: selectedNews => set({ selectedNews }),
  setFilters: filters => set({ filters }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  clearFilters: () => set({ filters: {} }),
}));
