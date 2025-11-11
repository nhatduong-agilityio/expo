import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { CONTENT_TABS, FILTER_CONTENT_TABS, ROUTES } from '@/constants';

// Mock data
import { mockAuthors, mockNews, mockTopics } from '@/mocks';

// Hooks
import { useDebounce } from '@/hooks';

// Components
import { AuthorCard, PostCard, TopicCard } from '@/components';
import { SearchBar, Tabs, Text } from '@/components/ui';

type NewsItem = (typeof mockNews)[0];
type TopicItem = (typeof mockTopics)[0];
type AuthorItem = (typeof mockAuthors)[0];

const SearchScreen = () => {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const { rt } = useUnistyles();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>(CONTENT_TABS.NEWS.ID);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    // Auto-focus the input when screen loads
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Memoize filtered data
  const filteredNews = useMemo(
    () =>
      mockNews.filter(
        item =>
          item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.category.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.authorName.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [debouncedSearch],
  );

  const filteredTopics = useMemo(
    () =>
      mockTopics.filter(
        item =>
          item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.description
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()),
      ),
    [debouncedSearch],
  );

  const filteredAuthors = useMemo(
    () =>
      mockAuthors.filter(item =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [debouncedSearch],
  );

  const handleAuthorPress = (authorId: string) => {
    router.push(ROUTES.AUTHOR_PROFILE(authorId));
  };

  // Memoized render functions
  const renderNewsItem = useCallback(
    ({ item }: { item: NewsItem }) => (
      <View style={styles.newsItem}>
        <PostCard
          variant="horizontal"
          image={item.image}
          category={item.category}
          title={item.title}
          authorAvatar={item.authorAvatar}
          authorName={item.authorName}
          authorId={item.authorId}
          timeAgo={item.timeAgo}
        />
      </View>
    ),
    [],
  );

  const renderTopicItem = useCallback(
    ({ item }: { item: TopicItem }) => (
      <View style={styles.topicItem}>
        <TopicCard
          image={item.image}
          title={item.title}
          description={item.description}
          saved={item.saved}
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

  // Memoized key extractors
  const newsKeyExtractor = useCallback((item: NewsItem) => item.id, []);
  const topicKeyExtractor = useCallback((item: TopicItem) => item.id, []);
  const authorKeyExtractor = useCallback((item: AuthorItem) => item.id, []);

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Text variant="body" color="secondary" align="center">
          {debouncedSearch
            ? `No ${activeTab} found for "${debouncedSearch}"`
            : `Start typing to search ${activeTab}`}
        </Text>
      </View>
    ),
    [debouncedSearch, activeTab],
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
            removeClippedSubviews={true}
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
            removeClippedSubviews={true}
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
            removeClippedSubviews={true}
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
          <Ionicons name="arrow-back" size={24} color={styles.backIcon.color} />
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
  backIcon: {
    color: theme.colors.iconPrimary,
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
