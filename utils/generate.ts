import { Category } from '@/types';

export const categoriesTabs = (categories?: Category[]) => {
  if (!categories) return [{ id: 'all', label: 'All' }];

  return [
    { id: 'all', label: 'All' },
    ...categories
      .filter(cat => cat.is_active)
      .sort((a, b) => a.display_order - b.display_order)
      .map(cat => ({
        id: cat.id,
        label: cat.name,
      })),
  ];
};
