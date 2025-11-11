import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

// Utils
import { formatNumber } from '@/utils';

// Components
import { Text } from './ui';

export type ProfileStatsProps = {
  followers: number;
  following: number;
  news: number;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
  onNewsPress?: () => void;
};

export const ProfileStats = memo(
  ({
    followers,
    following,
    news,
    onFollowersPress,
    onFollowingPress,
    onNewsPress,
  }: ProfileStatsProps) => {
    return (
      <View style={styles.container}>
        <Pressable
          style={styles.stat}
          onPress={onFollowersPress}
          accessibilityRole="button"
          accessibilityLabel={`${formatNumber(followers)} Followers`}
          accessibilityHint="Opens the followers screen"
        >
          <Text variant="h3" style={styles.statNumber}>
            {formatNumber(followers)}
          </Text>
          <Text variant="bodySm" color="secondary" style={styles.statLabel}>
            Followers
          </Text>
        </Pressable>

        <Pressable
          style={styles.stat}
          onPress={onFollowingPress}
          accessibilityRole="button"
          accessibilityLabel={`${formatNumber(following)} Following`}
          accessibilityHint="Opens the following screen"
        >
          <Text variant="h3" style={styles.statNumber}>
            {formatNumber(following)}
          </Text>
          <Text variant="bodySm" color="secondary" style={styles.statLabel}>
            Following
          </Text>
        </Pressable>

        <Pressable
          style={styles.stat}
          onPress={onNewsPress}
          accessibilityRole="button"
          accessibilityLabel={`${formatNumber(news)} News`}
          accessibilityHint="Opens the news screen"
        >
          <Text variant="h3" style={styles.statNumber}>
            {formatNumber(news)}
          </Text>
          <Text variant="bodySm" color="secondary" style={styles.statLabel}>
            News
          </Text>
        </Pressable>
      </View>
    );
  },
);

ProfileStats.displayName = 'ProfileStats';

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statNumber: {
    color: theme.colors.textPrimary,
  },
  statLabel: {
    color: theme.colors.textSecondary,
  },
}));
