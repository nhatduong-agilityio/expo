import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Mocks
import { mockPopularNews, mockTopics } from '@/mocks';

// Components
import { PostCard, TopicCard } from '@/components';
import { Text } from '@/components/ui';

type TopicItem = (typeof mockTopics)[0];
type NewsItem = (typeof mockPopularNews)[0];

// Define list item types for two separate sections
type ListItem =
  | { type: 'topic-header'; data: null }
  | { type: 'topic'; data: TopicItem }
  | { type: 'popular-header'; data: null }
  | { type: 'news'; data: NewsItem };

const ExploreScreen = () => {
  const insets = useSafeAreaInsets();
  const { rt } = useUnistyles();

  const [topics, setTopics] = useState(mockTopics);
  const [popularNews] = useState(mockPopularNews);

  const handleSeeAllTopicsPress = () => {
    // TODO: Navigate to see all topics screen
  };

  const handleTopicSave = (topicId: string, saved: boolean) => {
    setTopics(prevTopics =>
      prevTopics.map(topic =>
        topic.id === topicId ? { ...topic, saved } : topic,
      ),
    );
    // TODO: Call API to save/unsave topic
  };

  const handleTopicPress = (topicId: string) => {
    // TODO: Navigate to topic detail screen or filter by topic
  };

  const handleNewsPress = (newsId: string) => {
    // TODO: Navigate to news detail screen
  };

  // Combine data into a single list with type indicators
  const listData = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];

    // Add topic section header
    items.push({ type: 'topic-header', data: null });

    // Add all topics (categories)
    topics.forEach(topic => {
      items.push({ type: 'topic', data: topic });
    });

    // Add popular topic section header
    items.push({ type: 'popular-header', data: null });

    // Add popular news items
    popularNews.forEach(news => {
      items.push({ type: 'news', data: news });
    });

    return items;
  }, [topics, popularNews]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
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
              image={item.data.image}
              title={item.data.title}
              description={item.data.description}
              saved={item.data.saved}
              onSavePress={saved => handleTopicSave(item.data.id, saved)}
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
              variant="vertical"
              image={item.data.image}
              category={item.data.category}
              title={item.data.title}
              authorAvatar={item.data.authorAvatar}
              authorName={item.data.authorName}
              authorId={item.data.authorId}
              timeAgo={item.data.timeAgo}
              onPress={() => handleNewsPress(item.data.id)}
            />
          </View>
        );

      default:
        return null;
    }
  }, []);

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === 'topic-header') {
      return 'topic-header';
    }
    if (item.type === 'popular-header') {
      return 'popular-header';
    }
    if (item.type === 'topic') {
      return `topic-${item.data.id}`;
    }
    if (item.type === 'news') {
      return `news-${item.data.id}`;
    }
    return `item-${index}`;
  }, []);

  const getItemType = useCallback((item: ListItem) => {
    return item.type;
  }, []);

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
          { paddingBottom: insets.bottom },
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
}));

export default ExploreScreen;
