import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { FILTER_PROFILE_TABS, PROFILE_TABS } from '@/constants';

// Mock data
import { mockAuthors, mockUserNews } from '@/mocks';

// Components
import { PostCard, ProfileStats, ScreenHeader } from '@/components';
import { Avatar, Button, Tabs, Text } from '@/components/ui';

type NewsItem = (typeof mockUserNews)[0];

const AuthorProfileScreen = () => {
  const { rt } = useUnistyles();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id: authorId } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string>(PROFILE_TABS.RECENT.ID);
  const [isFollowing, setIsFollowing] = useState(false);

  const author = mockAuthors.find(a => a.id === authorId) || mockAuthors[0];

  const handleBackPress = () => {
    router.back();
  };

  const handleMenuPress = () => {
    // TODO: Handle menu press
  };

  const handleFollowPress = () => {
    setIsFollowing(!isFollowing);
  };

  const handleWebsitePress = () => {
    // TODO: Handle website press
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
    ({ item }: { item: NewsItem }) => (
      <View style={styles.newsItem}>
        <PostCard
          variant="horizontal"
          id={item.id}
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

      {/* Profile Header Content */}
      <View style={styles.profileHeader}>
        {/* Avatar and Stats Row */}
        <View style={styles.topSection}>
          <View style={styles.avatarContainer}>
            <Avatar source={author.avatar} size="xl" editable={false} />
          </View>

          {/* Profile Stats */}
          <ProfileStats
            followers={1200000}
            following={124000}
            news={326}
            onFollowersPress={handleFollowersPress}
            onFollowingPress={handleFollowingPress}
            onNewsPress={handleNewsPress}
          />
        </View>

        {/* Author Info */}
        <View style={styles.authorInfo}>
          <Text variant="h3" style={styles.authorName}>
            {author.name}
          </Text>
          <Text variant="body" color="secondary" style={styles.authorBio}>
            is an operational business division of the British Broadcasting
            Corporation responsible for the gathering and broadcasting of news
            and current affairs.
          </Text>
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
          <Button
            variant="primary"
            size="md"
            onPress={handleWebsitePress}
            style={styles.button}
          >
            Website
          </Button>
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

      {/* Scrollable News List */}
      <FlashList
        data={mockUserNews}
        renderItem={renderNewsItem}
        keyExtractor={newsKeyExtractor}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 20 },
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
}));

export default AuthorProfileScreen;
