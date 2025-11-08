import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

// Constants
import { CONTENT_TABS, FILTER_CONTENT_TABS } from '@/constants';

// Hooks
import { useDebounce } from '@/hooks';

// Components
import { AuthorCard, PostCard, TopicCard } from '@/components';
import { SearchBar, Tabs, Text } from '@/components/ui';

// Mock data
const mockNews = [
  {
    id: '1',
    category: 'Europe',
    title:
      "Ukraine's President Zelensky to BBC: Blood money being paid for Russian...",
    image: 'https://picsum.photos/400/300?random=1',
    authorAvatar: 'https://picsum.photos/100/100?random=1',
    authorName: 'BBC News',
    timeAgo: '14m ago',
  },
  {
    id: '2',
    category: 'Travel',
    title: 'Russian warship: Moskva sinks in Black Sea',
    image: 'https://picsum.photos/400/300?random=2',
    authorAvatar: 'https://picsum.photos/100/100?random=2',
    authorName: 'BBC News',
    timeAgo: '1h ago',
  },
  {
    id: '3',
    category: 'Travel',
    title:
      'Her train broke down. Her phone died. And then she met her future husband',
    image: 'https://picsum.photos/400/300?random=3',
    authorAvatar: 'https://picsum.photos/100/100?random=3',
    authorName: 'CNN',
    timeAgo: '1h ago',
  },
  {
    id: '4',
    category: 'Politics',
    title: 'Breaking: Major political development in Washington',
    image: 'https://picsum.photos/400/300?random=4',
    authorAvatar: 'https://picsum.photos/100/100?random=4',
    authorName: 'USA Today',
    timeAgo: '2h ago',
  },
  {
    id: '5',
    category: 'Technology',
    title: 'New AI breakthrough announced by leading tech company',
    image: 'https://picsum.photos/400/300?random=5',
    authorAvatar: 'https://picsum.photos/100/100?random=5',
    authorName: 'CNET',
    timeAgo: '3h ago',
  },
];

const mockTopics = [
  {
    id: '1',
    title: 'Health',
    description: 'View the latest health news and explore articles on...',
    image: 'https://picsum.photos/100/100?random=10',
    saved: false,
  },
  {
    id: '2',
    title: 'Technology',
    description: "The latest tech news about the world's best hardware...",
    image: 'https://picsum.photos/100/100?random=11',
    saved: true,
  },
  {
    id: '3',
    title: 'Art',
    description: 'The Art Newspaper is the journal of record for...',
    image: 'https://picsum.photos/100/100?random=12',
    saved: true,
  },
  {
    id: '4',
    title: 'Politics',
    description: 'opinion and analysis of American and global politi...',
    image: 'https://picsum.photos/100/100?random=13',
    saved: false,
  },
  {
    id: '5',
    title: 'Sport',
    description: 'Sports news and live sports coverage including scores...',
    image: 'https://picsum.photos/100/100?random=14',
    saved: false,
  },
  {
    id: '6',
    title: 'Travel',
    description: 'The latest travel news on the most significant developm...',
    image: 'https://picsum.photos/100/100?random=15',
    saved: false,
  },
  {
    id: '7',
    title: 'Money',
    description: 'The latest breaking financial news on the US and world...',
    image: 'https://picsum.photos/100/100?random=16',
    saved: false,
  },
];

const mockAuthors = [
  {
    id: '1',
    name: 'BBC News',
    avatar: 'https://picsum.photos/100/100?random=20',
    followers: '1.2M Followers',
    following: true,
  },
  {
    id: '2',
    name: 'CNN',
    avatar: 'https://picsum.photos/100/100?random=21',
    followers: '959K Followers',
    following: false,
  },
  {
    id: '3',
    name: 'Vox',
    avatar: 'https://picsum.photos/100/100?random=22',
    followers: '452K Followers',
    following: true,
  },
  {
    id: '4',
    name: 'USA Today',
    avatar: 'https://picsum.photos/100/100?random=23',
    followers: '325K Followers',
    following: true,
  },
  {
    id: '5',
    name: 'CNBC',
    avatar: 'https://picsum.photos/100/100?random=24',
    followers: '21K Followers',
    following: false,
  },
  {
    id: '6',
    name: 'CNET',
    avatar: 'https://picsum.photos/100/100?random=25',
    followers: '18K Followers',
    following: false,
  },
  {
    id: '7',
    name: 'MSN',
    avatar: 'https://picsum.photos/100/100?random=26',
    followers: '15K Followers',
    following: false,
  },
];

type NewsItem = (typeof mockNews)[0];
type TopicItem = (typeof mockTopics)[0];
type AuthorItem = (typeof mockAuthors)[0];

const SearchScreen = () => {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={8}
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
