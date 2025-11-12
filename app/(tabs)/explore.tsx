import { FlashList } from '@shopify/flash-list';
import { useCallback, useState } from 'react';
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

// Hooks
import { useCategories, useToggleSubscription, useTrendingNews } from '@/hooks';

// Types
import { Category, News } from '@/types';

// Components
import { PostCard, TopicCard } from '@/components';
import { Text } from '@/components/ui';

type ListItem =
  | { type: 'topic-header'; data: null }
  | { type: 'topic'; data: Category }
  | { type: 'popular-header'; data: null }
  | { type: 'news'; data: News };

const ExploreScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme, rt } = useUnistyles();

  // Fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
    isRefetching: categoriesRefetching,
  } = useCategories();

  // Fetch trending news
  const {
    data: trendingNews,
    isLoading: newsLoading,
    refetch: refetchNews,
    isRefetching: newsRefetching,
  } = useTrendingNews(10);

  // Toggle subscription mutation
  const { mutate: toggleSubscription } = useToggleSubscription();

  const [subscribedTopics, setSubscribedTopics] = useState<Set<string>>(
    new Set(),
  );

  const handleSeeAllTopicsPress = () => {
    // TODO: Navigate to see all topics screen
  };

  const handleTopicSave = useCallback(
    (categoryId: string) => {
      toggleSubscription(categoryId, {
        onSuccess: data => {
          setSubscribedTopics(prev => {
            const newSet = new Set(prev);
            if (data.subscribed) {
              newSet.add(categoryId);
            } else {
              newSet.delete(categoryId);
            }
            return newSet;
          });
        },
      });
    },
    [toggleSubscription],
  );

  const handleTopicPress = useCallback((categoryId: string) => {
    // TODO: Navigate to topic detail screen or filter by topic
  }, []);

  const handleNewsPress = (newsId: string) => {
    // TODO: Navigate to news detail screen
  };

  // Combine data into a single list
  const listData: ListItem[] = [];

  if (!categoriesLoading && categories) {
    listData.push({ type: 'topic-header', data: null });
    categories.forEach(category => {
      listData.push({ type: 'topic', data: category });
    });
  }

  if (!newsLoading && trendingNews) {
    listData.push({ type: 'popular-header', data: null });
    trendingNews.forEach(news => {
      listData.push({ type: 'news', data: news });
    });
  }

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      switch (item.type) {
        case 'topic-header':
          return (
            <View style={styles.sectionHeader}>
              <Text variant="h3" style={styles.sectionTitle}>
                Topic
              </Text>
              <Pressable
                onPress={handleSeeAllTopicsPress}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="See all topics"
                accessibilityHint="Navigates to a screen with all topics"
              >
                <Text variant="body" color="link">
                  See all
                </Text>
              </Pressable>
            </View>
          );

        case 'topic':
          return (
            <View style={styles.topicItem}>
              <TopicCard
                image={
                  item.data.iconUrl || 'https://picsum.photos/100/100?random=10'
                }
                title={item.data.name}
                description={item.data.description || ''}
                saved={subscribedTopics.has(item.data.id)}
                onSavePress={() => handleTopicSave(item.data.id)}
                onPress={() => handleTopicPress(item.data.id)}
              />
            </View>
          );

        case 'popular-header':
          return (
            <View style={styles.sectionHeader}>
              <Text variant="h3" style={styles.sectionTitle}>
                Popular Topic
              </Text>
            </View>
          );

        case 'news':
          return (
            <View style={styles.newsItem}>
              <PostCard
                post={item.data}
                variant="vertical"
                onPress={() => handleNewsPress(item.data.id)}
              />
            </View>
          );

        default:
          return null;
      }
    },
    [subscribedTopics, handleTopicSave, handleTopicPress],
  );

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === 'topic-header') return 'topic-header';
    if (item.type === 'popular-header') return 'popular-header';
    if (item.type === 'topic') return `topic-${item.data.id}`;
    if (item.type === 'news') return `news-${item.data.id}`;
    return `item-${index}`;
  }, []);

  const getItemType = useCallback((item: ListItem) => item.type, []);

  const isRefreshing = categoriesRefetching || newsRefetching;
  const isLoading = categoriesLoading || newsLoading;

  const handleRefresh = () => {
    refetchCategories();
    refetchNews();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
        <View style={styles.header}>
          <Text variant="h1" style={styles.title}>
            Explore
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>
          Explore
        </Text>
      </View>
      <FlashList
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
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
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    color: theme.colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
  },
  listContent: {
    paddingTop: 0,
  },
  topicItem: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  newsItem: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default ExploreScreen;
