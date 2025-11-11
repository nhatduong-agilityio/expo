import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Hooks
import { useDebounce } from '@/hooks';

// Mocks
import { mockNews } from '@/mocks';

// Components
import { PostCard } from '@/components';
import { SearchBar, Text } from '@/components/ui';

// TODO: Replace with real API data for bookmarked news
type NewsItem = (typeof mockNews)[0];

const BookmarkScreen = () => {
  const { theme, rt } = useUnistyles();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // TODO: Fetch bookmarked news from API
  const bookmarkedNews = mockNews;

  // Filter bookmarked news based on search query
  const filteredNews = useMemo(
    () =>
      bookmarkedNews.filter(
        item =>
          item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.category.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.authorName.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [debouncedSearch, bookmarkedNews],
  );

  const handleFilterPress = () => {
    // TODO: Open filter modal/sheet
  };

  const renderNewsItem = useCallback(
    ({ item }: { item: NewsItem }) => (
      <View style={styles.newsItem}>
        <PostCard variant="horizontal" {...item} />
      </View>
    ),
    [],
  );

  const newsKeyExtractor = useCallback((item: NewsItem) => item.id, []);

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Ionicons
          name="bookmark-outline"
          size={64}
          color={theme.colors.iconTertiary}
        />
        <Text variant="h3" align="center" style={styles.emptyTitle}>
          No bookmarks yet
        </Text>
        <Text variant="body" color="secondary" align="center">
          {debouncedSearch
            ? `No bookmarks found for "${debouncedSearch}"`
            : 'Save articles to read them later'}
        </Text>
      </View>
    ),
    [debouncedSearch, theme],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
      {/* Page Title */}
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>
          Bookmark
        </Text>
      </View>

      {/* Search Bar with Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
          />
        </View>
        <Pressable
          onPress={handleFilterPress}
          style={styles.filterButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Filter bookmarks"
          accessibilityHint="Opens a modal to filter your bookmarked articles"
        >
          <Ionicons
            name="options-outline"
            size={24}
            color={theme.colors.iconPrimary}
          />
        </Pressable>
      </View>
      <FlashList
        data={filteredNews}
        renderItem={renderNewsItem}
        keyExtractor={newsKeyExtractor}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    color: theme.colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  searchWrapper: {
    flex: 1,
  },
  filterButton: {
    padding: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingTop: 0,
  },
  newsItem: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing['4xl'],
    gap: theme.spacing.md,
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
  },
}));

export default BookmarkScreen;
