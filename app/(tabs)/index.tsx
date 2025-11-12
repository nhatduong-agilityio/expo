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

// Components
import { PostCard } from '@/components';
import { SearchBar, Tabs, Text } from '@/components/ui';
import { categoriesTabs, getTimeAgo } from '@/utils';

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
  const newsItems = data?.pages.flatMap(page => page.data) ?? [];

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
        <PostCard
          id={item.id}
          variant="horizontal"
          image={item.featured_image_url || 'https://picsum.photos/400/300'}
          category={item.category?.name || 'Uncategorized'}
          title={item.title}
          authorAvatar={
            item.author?.avatar_url || 'https://picsum.photos/100/100'
          }
          authorName={item.author?.full_name || 'Anonymous'}
          authorId={item.author_id}
          timeAgo={getTimeAgo(item.published_at || item.created_at)}
        />
      </View>
    ),
    [],
  );

  const newsKeyExtractor = useCallback((item: News) => item.id, []);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading || categoriesLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text variant="body" color="secondary" align="center">
          No news available
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
      {/* App Logo */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          contentFit="cover"
          transition={200}
          placeholder={{ blurhash: BLUR_HASH }}
          accessibilityIgnoresInvertColors
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar editable={false} onPress={handleSearchPress} />
      </View>

      {/* Latest Section Header */}
      <View style={styles.sectionHeader}>
        <Text variant="button" style={styles.sectionTitle}>
          Latest
        </Text>
        <Pressable
          onPress={handleSeeAllPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="See all latest news"
          accessibilityHint="Navigates to a screen with all the latest news"
        >
          <Text variant="bodySm" color="link">
            See all
          </Text>
        </Pressable>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        <Tabs
          tabs={FILTER_CATEGORY_TABS}
          activeTab={activeCategory}
          onTabChange={setActiveCategory}
        />
      </View>

      <FlashList
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
          />
        }
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
    paddingTop: 0,
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
