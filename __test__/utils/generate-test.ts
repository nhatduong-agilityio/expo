import { mockTopics } from '@/mocks';
import { categoriesTabs } from '@/utils';

describe('categoriesTabs', () => {
  it('should return default tab when no categories provided', () => {
    const result = categoriesTabs(undefined);
    expect(result).toEqual([{ id: 'all', label: 'All' }]);
  });

  it('should return default tab when empty categories array', () => {
    const result = categoriesTabs([]);
    expect(result).toEqual([{ id: 'all', label: 'All' }]);
  });

  it('should generate tabs from categories', () => {
    const result = categoriesTabs(mockTopics);
    expect(result).toHaveLength(6);
    expect(result[0]).toEqual({ id: 'all', label: 'All' });
    expect(result[1]).toEqual({
      id: mockTopics[0].id,
      label: mockTopics[0].name,
    });
  });

  it('should filter out inactive categories', () => {
    const categoriesWithInactive = [
      ...mockTopics,
      {
        id: 'cat-3',
        name: 'Inactive',
        slug: 'inactive',
        description: 'Inactive category',
        iconUrl: null,
        displayOrder: 3,
        isActive: false,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ];

    const result = categoriesTabs(categoriesWithInactive);
    expect(result).toHaveLength(6);
    expect(result.find(tab => tab.label === 'Inactive')).toBeUndefined();
  });

  it('should sort categories by display order', () => {
    const unsortedCategories = [
      {
        id: 'cat-2',
        name: 'Second',
        slug: 'second',
        description: 'Second category',
        iconUrl: null,
        displayOrder: 2,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'cat-1',
        name: 'First',
        slug: 'first',
        description: 'First category',
        iconUrl: null,
        displayOrder: 1,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ];

    const result = categoriesTabs(unsortedCategories);
    expect(result[1].label).toBe('First');
    expect(result[2].label).toBe('Second');
  });
});
