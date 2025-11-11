import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Mocks
import { mockNews } from '@/mocks';

// Constants
import {
  BLUR_HASH,
  CATEGORY_TABS,
  FILTER_CATEGORY_TABS,
  ROUTES,
} from '@/constants';

// Components
import { PostCard } from '@/components';
import { SearchBar, Tabs, Text } from '@/components/ui';

// TODO: Replace with real API data
type NewsItem = (typeof mockNews)[0];

const HomeScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState<string>(
    CATEGORY_TABS.ALL.ID,
  );
  const { rt } = useUnistyles();

  // Filter news by selected category
  const filteredNews = useMemo(() => {
    if (activeCategory === CATEGORY_TABS.ALL.ID) {
      return mockNews;
    }
    return mockNews.filter(
      news => news.category.toLowerCase() === activeCategory.toLowerCase(),
    );
  }, [activeCategory]);

  const handleSearchPress = () => {
    router.push(ROUTES.SEARCH);
  };

  const handleSeeAllPress = () => {
    // TODO: Navigate to see all news screen
  };

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

  const newsKeyExtractor = useCallback((item: NewsItem) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
      {/* App Logo and Notification */}
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
        data={filteredNews}
        renderItem={renderNewsItem}
        keyExtractor={newsKeyExtractor}
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
}));

export default HomeScreen;
