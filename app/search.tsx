import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { CONTENT_TABS, FILTER_CONTENT_TABS, ROUTES } from '@/constants';

// Hooks
import { useCategories, useDebounce, useNews } from '@/hooks';

// Types
import { Category, News } from '@/types';

// Components
import { AuthorCard, PostCard, TopicCard } from '@/components';
import { SearchBar, Tabs, Text } from '@/components/ui';

type NewsItem = News;
type TopicItem = Category;
type AuthorItem = {
  id: string;
  name: string;
  avatar: string;
  followers: string;
  following: boolean;
};

const SearchScreen = () => {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const { theme, rt } = useUnistyles();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>(CONTENT_TABS.NEWS.ID);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch news based on search
  const { data: newsData, isLoading: newsLoading } = useNews(
    { search: debouncedSearch },
    { page: 1, limit: 50 },
  );

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const filteredNews = newsData?.data || [];

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

  // Mock authors for now - you can create a separate service for this
  const filteredAuthors: AuthorItem[] = useMemo(() => {
    if (!debouncedSearch) return [];
    // Extract unique authors from news
    const authorsMap = new Map<string, AuthorItem>();
    filteredNews.forEach(news => {
      if (news.author && !authorsMap.has(news.author.id)) {
        authorsMap.set(news.author.id, {
          id: news.author.id,
          name: news.author.full_name || 'Anonymous',
          avatar: news.author.avatar_url || 'https://picsum.photos/100/100',
          followers: `${news.author.followers_count} Followers`,
          following: false,
        });
      }
    });
    return Array.from(authorsMap.values());
  }, [debouncedSearch, filteredNews]);

  const handleAuthorPress = (authorId: string) => {
    router.push(ROUTES.AUTHOR_PROFILE(authorId));
  };

  const renderNewsItem = useCallback(
    ({ item }: { item: NewsItem }) => (
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

  const renderTopicItem = useCallback(
    ({ item }: { item: TopicItem }) => (
      <View style={styles.topicItem}>
        <TopicCard
          image={item.icon_url || 'https://picsum.photos/100/100'}
          title={item.name}
          description={item.description || ''}
          saved={false}
        />
      </View>
    ),
    [],
  );

  const renderAuthorItem = useCallback(
    ({ item }: { item: AuthorItem }) => (
      <View style={styles.authorItem}>
        <AuthorCard
          avatar={item.avatar}
          name={item.name}
          followers={item.followers}
          following={item.following}
          onPress={() => handleAuthorPress(item.id)}
        />
      </View>
    ),
    [],
  );

  const newsKeyExtractor = useCallback((item: NewsItem) => item.id, []);
  const topicKeyExtractor = useCallback((item: TopicItem) => item.id, []);
  const authorKeyExtractor = useCallback((item: AuthorItem) => item.id, []);

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        {newsLoading || categoriesLoading ? (
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
    [debouncedSearch, activeTab, newsLoading, categoriesLoading, theme],
  );

  const renderContent = () => {
    switch (activeTab) {
      case CONTENT_TABS.NEWS.ID:
        return (
          <FlashList
            data={filteredNews}
            renderItem={renderNewsItem}
            keyExtractor={newsKeyExtractor}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        );
      case CONTENT_TABS.TOPICS.ID:
        return (
          <FlashList
            data={filteredTopics}
            renderItem={renderTopicItem}
            keyExtractor={topicKeyExtractor}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        );
      case CONTENT_TABS.AUTHOR.ID:
        return (
          <FlashList
            data={filteredAuthors}
            renderItem={renderAuthorItem}
            keyExtractor={authorKeyExtractor}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
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
          style={styles.backButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Navigates to the previous screen"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.iconPrimary}
          />
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

      <View style={styles.tabsContainer}>
        <Tabs
          variant="secondary"
          tabs={FILTER_CONTENT_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
};

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  searchContainer: {
    flex: 1,
  },
  tabsContainer: {
    marginBottom: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  newsItem: {
    marginBottom: theme.spacing.md,
  },
  topicItem: {
    marginBottom: theme.spacing.sm,
  },
  authorItem: {
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    paddingVertical: theme.spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default SearchScreen;
