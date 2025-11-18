import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { BLUR_HASH, CATEGORY_TABS, ROUTES } from '@/constants';

// Hooks
import { useCategories, useInfiniteNews } from '@/hooks';

// Types
import { News } from '@/types';

// Utils
import { categoriesTabs } from '@/utils';

// Components
import { PostCard } from '@/components';
import { SearchBar, Tabs, Text } from '@/components/ui';

const HomeScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, rt } = useUnistyles();
  const [activeCategory, setActiveCategory] = useState<string>(
    CATEGORY_TABS.ALL.ID,
  );

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Fetch news with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInfiniteNews(
    activeCategory === CATEGORY_TABS.ALL.ID ? {} : { category: activeCategory },
    10,
  );

  // Flatten paginated data
  const newsItems = useMemo(
    () => data?.pages.flatMap(page => page.data) ?? [],
    [data?.pages],
  );

  // Generate tabs from categories
  const FILTER_CATEGORY_TABS = useMemo(
    () => categoriesTabs(categories),
    [categories],
  );

  const handleSearchPress = () => {
    router.push(ROUTES.SEARCH);
  };

  const handleSeeAllPress = () => {
    // TODO: Navigate to see all news screen
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderNewsItem = useCallback(
    ({ item }: { item: News }) => (
      <View style={styles.newsItem}>
        <PostCard post={item} variant="horizontal" />
      </View>
    ),
    [],
  );

  const newsKeyExtractor = useCallback((item: News) => item.id, []);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View
        style={styles.footerLoader}
        accessibilityLabel="Loading more news"
        accessibilityHint="Loading more news"
      >
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading || categoriesLoading) {
      return (
        <View
          style={styles.emptyState}
          accessibilityLabel="Loading news"
          accessibilityHint="Loading news"
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text
          variant="body"
          color="secondary"
          align="center"
          accessibilityLabel="No news available"
          accessibilityHint="No news available"
        >
          No news available
        </Text>
      </View>
    );
  };

  const activeCategoryName = useMemo(() => {
    if (activeCategory === CATEGORY_TABS.ALL.ID) return 'All categories';
    const category = categories?.find(cat => cat.id === activeCategory);
    return category?.name || 'Unknown category';
  }, [activeCategory, categories]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
      key={rt.themeName}
      accessibilityLabel="Home screen"
      accessibilityHint="Home screen"
    >
      {/* App Logo */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          contentFit="cover"
          placeholder={{ blurhash: BLUR_HASH }}
          accessibilityIgnoresInvertColors
          accessibilityLabel="News App Logo"
          accessible={true}
          accessibilityHint="News App Logo"
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          editable={false}
          onPress={handleSearchPress}
          accessibilityLabel="Search news"
          accessibilityHint="Double tap to open search screen"
        />
      </View>

      {/* Latest Section Header */}
      <View style={styles.sectionHeader}>
        <Text
          variant="button"
          style={styles.sectionTitle}
          accessibilityRole="header"
        >
          Latest
        </Text>
        <Pressable
          onPress={handleSeeAllPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="See all latest news"
          accessibilityHint="Double tap to view all the latest news articles"
        >
          <Text variant="bodySm" color="link">
            See all
          </Text>
        </Pressable>
      </View>

      {/* Category Tabs */}
      <View
        style={styles.tabsContainer}
        accessibilityLabel={`Category filter. Currently showing ${activeCategoryName}`}
        accessibilityHint={`Category filter. Currently showing ${activeCategoryName}`}
      >
        <Tabs
          tabs={FILTER_CATEGORY_TABS}
          activeTab={activeCategory}
          onTabChange={setActiveCategory}
        />
      </View>

      <FlashList
        key={activeCategory}
        data={newsItems}
        renderItem={renderNewsItem}
        keyExtractor={newsKeyExtractor}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            accessibilityLabel="Pull to refresh news"
            accessibilityHint="Pull to refresh news"
          />
        }
        accessibilityLabel={`News list showing ${newsItems.length} articles in ${activeCategoryName}`}
        accessibilityHint={`News list showing ${newsItems.length} articles in ${activeCategoryName}`}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  logo: {
    width: 99,
    height: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
  },
  tabsContainer: {
    paddingLeft: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  listContent: {
    paddingTop: theme.spacing.sm,
  },
  newsItem: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  footerLoader: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing['4xl'],
  },
}));

export default HomeScreen;
