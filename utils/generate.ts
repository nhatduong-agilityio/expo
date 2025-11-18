import { TABS } from '@/constants';
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

/**
 * Returns the configuration for the given route name from the TABS constant.
 * @param {string} routeName - The name of the route to find the configuration for.
 * @returns {object|undefined} - The configuration object for the given route name or undefined if not found.
 */
export const getTabBarConfig = (routeName: string) => {
  return Object.values(TABS).find(tab => tab.NAME === routeName);
};
