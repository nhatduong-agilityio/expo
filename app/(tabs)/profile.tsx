import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
// Constants
import { FILTER_PROFILE_TABS, PROFILE_TABS, ROUTES } from '@/constants';

// Hooks
import { useInfiniteNews } from '@/hooks';

// Stores
import { useAuthStore } from '@/stores';

// Types
import { News } from '@/types';

// Components
import { PostCard, ProfileStats, ScreenHeader } from '@/components';
import { Avatar, Button, FloatButton, Tabs, Text } from '@/components/ui';

const ProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, rt } = useUnistyles();
  const [activeTab, setActiveTab] = useState<string>(PROFILE_TABS.RECENT.ID);

  // Get current user
  const { user, profile } = useAuthStore();

  // Fetch user's news with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInfiniteNews({ authorId: user?.id }, 10);

  // Flatten paginated data
  const userNews = useMemo(
    () => data?.pages.flatMap(page => page.data) ?? [],
    [data],
  );

  const handleSettingsPress = () => {
    router.push(ROUTES.SETTINGS);
  };

  const handleEditProfilePress = () => {
    router.push(ROUTES.EDIT_PROFILE);
  };

  const handleCreatePostPress = () => {
    router.push(ROUTES.CREATE_POST);
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

  const handlePressOpenWebsite = async () => {
    await WebBrowser.openBrowserAsync(profile?.website || '');
  };

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderNewsItem = useCallback(
    ({ item }: { item: News }) => (
      <View style={styles.newsItem}>
        <PostCard post={item} variant="horizontal" />
      </View>
    ),
    [],
  );

  const newsKeyExtractor = useCallback((item: News) => item.id, []);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [isFetchingNextPage, theme]);

  const renderHeader = () => (
    <View style={styles.profileHeader}>
      {/* Avatar and Stats Row */}
      <View style={styles.topSection}>
        <View style={styles.avatarContainer}>
          <Avatar
            source={profile?.avatarUrl || null}
            size="xl"
            editable={false}
            fallbackLabel={profile?.fullName?.charAt(0) || 'U'}
          />
        </View>

        {/* Profile Stats */}
        <ProfileStats
          followers={profile?.followersCount || 0}
          following={profile?.followingCount || 0}
          news={profile?.newsCount || 0}
          onFollowersPress={handleFollowersPress}
          onFollowingPress={handleFollowingPress}
          onNewsPress={handleNewsPress}
        />
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text variant="h3" style={styles.userName}>
          {profile?.fullName || 'Anonymous User'}
        </Text>
        {profile?.bio && (
          <Text variant="body" color="secondary" style={styles.userBio}>
            {profile.bio}
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          variant="primary"
          size="md"
          onPress={handleEditProfilePress}
          style={styles.button}
        >
          Edit profile
        </Button>
        {profile?.website && (
          <Button
            variant="primary"
            size="md"
            style={styles.button}
            onPress={handlePressOpenWebsite}
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

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text variant="body" color="secondary" align="center">
        No news published yet
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
        <ScreenHeader
          title="Profile"
          rightIcon="settings-outline"
          onRightPress={handleSettingsPress}
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
      {/* Fixed Header */}
      <ScreenHeader
        title="Profile"
        rightIcon="settings-outline"
        onRightPress={handleSettingsPress}
        showRightIcon
      />

      {/* Scrollable News List */}
      <FlashList
        key={activeTab}
        data={userNews}
        renderItem={renderNewsItem}
        keyExtractor={newsKeyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
      />

      {/* Floating Action Button */}
      <FloatButton
        iconName="add"
        position="bottom-right"
        onPress={handleCreatePostPress}
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
  userInfo: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  userName: {
    color: theme.colors.textPrimary,
  },
  userBio: {
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
  footerLoader: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
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

export default ProfileScreen;
