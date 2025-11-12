import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { FILTER_PROFILE_TABS, PROFILE_TABS } from '@/constants';

// Hooks
import { useIsFollowing, useNews, useToggleFollow } from '@/hooks';

// Services
import { authService } from '@/services';

// Types
import { News, Profile } from '@/types';

// Components
import { PostCard, ProfileStats, ScreenHeader } from '@/components';
import { Avatar, Button, Tabs, Text } from '@/components/ui';

const AuthorProfileScreen = () => {
  const { theme, rt } = useUnistyles();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id: authorId } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string>(PROFILE_TABS.RECENT.ID);
  const [author, setAuthor] = useState<Profile | null>(null);

  // Fetch author profile
  useEffect(() => {
    if (authorId) {
      authService.getProfile(authorId).then(setAuthor);
    }
  }, [authorId]);

  // Check if following
  const { data: isFollowingData } = useIsFollowing(authorId!);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (isFollowingData !== undefined) {
      setIsFollowing(isFollowingData);
    }
  }, [isFollowingData]);

  // Toggle follow mutation
  const { mutate: toggleFollow } = useToggleFollow();

  // Fetch author's news
  const { data, isLoading, refetch, isRefetching } = useNews(
    { author_id: authorId },
    { page: 1, limit: 50 },
  );

  const authorNews = data?.data || [];

  const handleBackPress = () => {
    router.back();
  };

  const handleMenuPress = () => {
    // TODO: Handle menu press
  };

  const handleFollowPress = () => {
    setIsFollowing(!isFollowing);
    toggleFollow(authorId!);
  };

  const handleWebsitePress = () => {
    // TODO: Open website
  };

  const handleFollowersPress = () => {
    // TODO: Handle followers press
  };

  const handleFollowingPress = () => {
    // TODO: Handle following press
  };

  const handleNewsPress = () => {
    // TODO: Handle news press
  };

  const renderNewsItem = useCallback(
    ({ item }: { item: News }) => (
      <View style={styles.newsItem}>
        <PostCard
          variant="horizontal"
          id={item.id}
          image={item.featured_image_url || 'https://picsum.photos/400/300'}
          category={item.category?.name || 'Uncategorized'}
          title={item.title}
          authorAvatar={author?.avatar_url || 'https://picsum.photos/100/100'}
          authorName={author?.full_name || 'Anonymous'}
          authorId={item.author_id}
          timeAgo={getTimeAgo(item.published_at || item.created_at)}
        />
      </View>
    ),
    [author],
  );

  const newsKeyExtractor = useCallback((item: News) => item.id, []);

  const renderHeader = () => {
    if (!author) return null;

    return (
      <View style={styles.profileHeader}>
        {/* Avatar and Stats Row */}
        <View style={styles.topSection}>
          <View style={styles.avatarContainer}>
            <Avatar
              source={author.avatar_url || null}
              size="xl"
              editable={false}
              fallbackLabel={author.full_name?.charAt(0) || 'A'}
            />
          </View>

          {/* Profile Stats */}
          <ProfileStats
            followers={author.followers_count}
            following={author.following_count}
            news={author.news_count}
            onFollowersPress={handleFollowersPress}
            onFollowingPress={handleFollowingPress}
            onNewsPress={handleNewsPress}
          />
        </View>

        {/* Author Info */}
        <View style={styles.authorInfo}>
          <Text variant="h3" style={styles.authorName}>
            {author.full_name || 'Anonymous'}
          </Text>
          {author.bio && (
            <Text variant="body" color="secondary" style={styles.authorBio}>
              {author.bio}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            variant="primary"
            size="md"
            onPress={handleFollowPress}
            style={styles.button}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
          {author.website && (
            <Button
              variant="primary"
              size="md"
              onPress={handleWebsitePress}
              style={styles.button}
            >
              Website
            </Button>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Tabs
            variant="secondary"
            tabs={FILTER_PROFILE_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text variant="body" color="secondary" align="center">
        No news published yet
      </Text>
    </View>
  );

  if (isLoading || !author) {
    return (
      <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
        <ScreenHeader
          title=""
          leftIcon="arrow-back"
          rightIcon="ellipsis-vertical"
          onLeftPress={handleBackPress}
          onRightPress={handleMenuPress}
          showLeftIcon
          showRightIcon
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
      {/* Header */}
      <ScreenHeader
        title=""
        leftIcon="arrow-back"
        rightIcon="ellipsis-vertical"
        onLeftPress={handleBackPress}
        onRightPress={handleMenuPress}
        showLeftIcon
        showRightIcon
      />

      {/* Scrollable News List */}
      <FlashList
        data={authorNews}
        renderItem={renderNewsItem}
        keyExtractor={newsKeyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 20 },
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
  profileHeader: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  avatarContainer: {
    width: 140,
  },
  authorInfo: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  authorName: {
    color: theme.colors.textPrimary,
  },
  authorBio: {
    color: theme.colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  button: {
    flex: 1,
  },
  tabsContainer: {
    marginBottom: theme.spacing.lg,
  },
  newsItem: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  listContent: {
    paddingTop: 0,
  },
  emptyState: {
    paddingVertical: theme.spacing['4xl'],
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default AuthorProfileScreen;
