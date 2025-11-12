import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Hooks
import { useBookmarks, useDebounce } from '@/hooks';

// Types
import { Bookmark } from '@/types';

// Components
import { PostCard } from '@/components';
import { SearchBar, Text } from '@/components/ui';

const BookmarkScreen = () => {
  const { theme, rt } = useUnistyles();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch bookmarks
  const { data, isLoading, refetch, isRefetching } = useBookmarks({
    page: 1,
    limit: 100,
  });

  const bookmarks = useMemo(() => data?.data || [], [data]);

  // Filter bookmarks based on search query
  const filteredBookmarks = useMemo(
    () =>
      bookmarks.filter(bookmark => {
        if (!bookmark.news) return false;
        const news = bookmark.news;
        return (
          news.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          news.category?.name
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          news.author?.fullName
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        );
      }),
    [debouncedSearch, bookmarks],
  );

  const renderBookmarkItem = useCallback(({ item }: { item: Bookmark }) => {
    if (!item.news) return null;

    return (
      <View style={styles.newsItem}>
        <PostCard post={item.news} variant="horizontal" />
      </View>
    );
  }, []);

  const bookmarkKeyExtractor = useCallback((item: Bookmark) => item.id, []);

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

  const renderLoader = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
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
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
          rightIcon="options-outline"
        />
      </View>

      {isLoading ? (
        renderLoader()
      ) : (
        <FlashList
          data={filteredBookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={bookmarkKeyExtractor}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default BookmarkScreen;
