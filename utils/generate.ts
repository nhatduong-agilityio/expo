import { Category } from '@/types';

export const categoriesTabs = (categories?: Category[]) => {
  if (!categories) return [{ id: 'all', label: 'All' }];

  return [
    { id: 'all', label: 'All' },
    ...categories
      .filter(cat => cat.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(cat => ({
        id: cat.id,
        label: cat.name,
      })),
  ];
};
