import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

// Constants
import { FILTER_PROFILE_TABS, PROFILE_TABS, ROUTES } from '@/constants';

// Mock data
import { mockUserNews } from '@/mocks';

// Components
import { PostCard, ProfileStats, ScreenHeader } from '@/components';
import { Avatar, Button, FloatButton, Tabs, Text } from '@/components/ui';

type NewsItem = (typeof mockUserNews)[0];

const ProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<string>(PROFILE_TABS.RECENT.ID);

  const handleSettingsPress = () => {
    router.push(ROUTES.SETTINGS);
  };

  const handleEditProfilePress = () => {
    router.push(ROUTES.EDIT_PROFILE);
  };

  const handleFollowersPress = () => {
    console.log('Followers pressed');
  };

  const handleFollowingPress = () => {
    console.log('Following pressed');
  };

  const handleNewsPress = () => {
    console.log('News pressed');
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
          timeAgo={item.timeAgo}
        />
      </View>
    ),
    [],
  );

  const newsKeyExtractor = useCallback((item: NewsItem) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <ScreenHeader
        title="Profile"
        rightIcon="settings-outline"
        onRightPress={handleSettingsPress}
        showRightIcon
      />

      {/* Profile Header Content */}
      <View style={styles.profileHeader}>
        {/* Avatar and Stats Row */}
        <View style={styles.topSection}>
          <View style={styles.avatarContainer}>
            <Avatar
              source="https://picsum.photos/200/200?random=1"
              size="xl"
              editable={false}
              rounded={true}
            />
          </View>

          {/* Profile Stats
            TODO: Update with real data from api
          */}
          <ProfileStats
            followers={2156}
            following={567}
            news={23}
            onFollowersPress={handleFollowersPress}
            onFollowingPress={handleFollowingPress}
            onNewsPress={handleNewsPress}
          />
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text variant="h3" style={styles.userName}>
            Wilson Franci
          </Text>
          <Text variant="body" color="secondary" style={styles.userBio}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Text>
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
          <Button variant="primary" size="md" style={styles.button}>
            Website
          </Button>
        </View>

        {/* Tabs */}
        <Tabs
          tabs={FILTER_PROFILE_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      {/* Scrollable News List */}
      <FlashList
        data={mockUserNews}
        renderItem={renderNewsItem}
        keyExtractor={newsKeyExtractor}
        contentContainerStyle={[{ paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <FloatButton iconName="add" position="bottom-right" />
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
  newsItem: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
}));

export default ProfileScreen;
