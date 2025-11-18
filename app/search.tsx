import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { CONTENT_TABS, FILTER_CONTENT_TABS, ROUTES } from '@/constants';

// Hooks
import {
  useCategories,
  useDebounce,
  useInfiniteAuthors,
  useInfiniteNews,
} from '@/hooks';

// Types
import { Author, Category, News } from '@/types';

// Components
import { AuthorCard, PostCard, TopicCard } from '@/components';
import { BackOutline } from '@/components/icons';
import { SearchBar, Tabs, Text } from '@/components/ui';

type NewsItem = News;
type TopicItem = Category;
type AuthorItem = Author;

const SearchScreen = () => {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const { theme, rt } = useUnistyles();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>(CONTENT_TABS.NEWS.ID);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Fetch news based on search with infinite scroll
  const {
    data: newsData,
    fetchNextPage: fetchNextNewsPage,
    hasNextPage: hasNextNewsPage,
    isFetchingNextPage: isFetchingNextNewsPage,
    isLoading: newsLoading,
    refetch: refetchNews,
    isRefetching: newsRefetching,
  } = useInfiniteNews(
    {
      search: debouncedSearch,
    },
    20,
  );

  // Fetch authors with infinite scroll
  const {
    data: authorsData,
    fetchNextPage: fetchNextAuthorsPage,
    hasNextPage: hasNextAuthorsPage,
    isFetchingNextPage: isFetchingNextAuthorsPage,
    isLoading: authorsLoading,
    refetch: refetchAuthors,
    isRefetching: authorsRefetching,
  } = useInfiniteAuthors(debouncedSearch, 20);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Flatten paginated news data
  const allNews = useMemo(
    () => newsData?.pages.flatMap(page => page.data) ?? [],
    [newsData],
  );

  // Flatten paginated authors data
  const allAuthors = useMemo(
    () => authorsData?.pages.flatMap(page => page.data) ?? [],
    [authorsData],
  );

  // Filter topics based on search
  const filteredTopics = useMemo(
    () =>
      (categories || []).filter(
        item =>
          item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.description
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()),
      ),
    [debouncedSearch, categories],
  );

  const handleAuthorPress = useCallback(
    (authorId: string) => {
      router.push(ROUTES.AUTHOR_PROFILE(authorId));
    },
    [router],
  );

  const handleLoadMoreNews = useCallback(() => {
    if (hasNextNewsPage && !isFetchingNextNewsPage) {
      fetchNextNewsPage();
    }
  }, [hasNextNewsPage, isFetchingNextNewsPage, fetchNextNewsPage]);

  const handleLoadMoreAuthors = useCallback(() => {
    if (hasNextAuthorsPage && !isFetchingNextAuthorsPage) {
      fetchNextAuthorsPage();
    }
  }, [hasNextAuthorsPage, isFetchingNextAuthorsPage, fetchNextAuthorsPage]);

  const renderNewsItem = useCallback(
    ({ item }: { item: NewsItem }) => (
      <View style={styles.newsItem}>
        <PostCard post={item} variant="horizontal" />
      </View>
    ),
    [],
  );

  const renderTopicItem = useCallback(
    ({ item }: { item: TopicItem }) => (
      <View style={styles.topicItem}>
        <TopicCard category={item} />
      </View>
    ),
    [],
  );

  const renderAuthorItem = useCallback(
    ({ item }: { item: AuthorItem }) => (
      <View style={styles.authorItem}>
        <AuthorCard
          authorId={item.id}
          avatar={item.avatarUrl}
          name={item.fullName}
          followers={item.followersCount}
          following={item.following}
          onPress={() => handleAuthorPress(item.id)}
        />
      </View>
    ),
    [handleAuthorPress],
  );

  const newsKeyExtractor = useCallback((item: NewsItem) => item.id, []);
  const topicKeyExtractor = useCallback((item: TopicItem) => item.id, []);
  const authorKeyExtractor = useCallback((item: AuthorItem) => item.id, []);

  const renderNewsFooter = useCallback(() => {
    if (!isFetchingNextNewsPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [isFetchingNextNewsPage, theme]);

  const renderAuthorsFooter = useCallback(() => {
    if (!isFetchingNextAuthorsPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [isFetchingNextAuthorsPage, theme]);

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        {newsLoading || categoriesLoading || authorsLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <Text variant="body" color="secondary" align="center">
            {debouncedSearch
              ? `No ${activeTab} found for "${debouncedSearch}"`
              : `Start typing to search ${activeTab}`}
          </Text>
        )}
      </View>
    ),
    [
      debouncedSearch,
      activeTab,
      newsLoading,
      categoriesLoading,
      authorsLoading,
      theme,
    ],
  );

  const renderContent = () => {
    switch (activeTab) {
      case CONTENT_TABS.NEWS.ID:
        return (
          <FlashList
            key={activeTab}
            data={allNews}
            renderItem={renderNewsItem}
            keyExtractor={newsKeyExtractor}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderNewsFooter}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMoreNews}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={newsRefetching}
                onRefresh={refetchNews}
                tintColor={theme.colors.primary}
              />
            }
          />
        );
      case CONTENT_TABS.TOPICS.ID:
        return (
          <FlashList
            key={activeTab}
            data={filteredTopics}
            renderItem={renderTopicItem}
            keyExtractor={topicKeyExtractor}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={false}
                tintColor={theme.colors.primary}
              />
            }
          />
        );
      case CONTENT_TABS.AUTHOR.ID:
        return (
          <FlashList
            key={activeTab}
            data={allAuthors}
            renderItem={renderAuthorItem}
            keyExtractor={authorKeyExtractor}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderAuthorsFooter}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMoreAuthors}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={authorsRefetching}
                onRefresh={refetchAuthors}
                tintColor={theme.colors.primary}
              />
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Navigates to the previous screen"
        >
          <BackOutline />
        </Pressable>
        <View style={styles.searchContainer}>
          <SearchBar
            ref={inputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      </View>
      <Tabs
        variant="secondary"
        tabs={FILTER_CONTENT_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  searchContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  newsItem: {
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  topicItem: {
    marginBottom: theme.spacing.lg,
  },
  authorItem: {
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  footerLoader: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  emptyState: {
    paddingVertical: theme.spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default SearchScreen;
