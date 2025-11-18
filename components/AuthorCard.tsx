import { memo } from 'react';
import {
  ImageSourcePropType,
  Platform,
  Pressable,
  PressableProps,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

// Hooks
import { useIsFollowing, useToggleFollow } from '@/hooks';

// Utils
import { formatNumber, getTimeAgo } from '@/utils';

// Components
import { AddOutline } from './icons';
import { Avatar, Button, Text } from './ui';

export type AuthorCardProps = Omit<PressableProps, 'children'> & {
  avatar?: ImageSourcePropType | string | null;
  size?: 'xs' | 'md' | 'lg';
  followers?: number;
  following?: boolean;
  timeCreated?: string;
  name?: string | null;
  authorId: string;
  onFollowPress?: (following: boolean) => void;
  showFollowButton?: boolean;
};

export const AuthorCard = memo(
  ({
    avatar,
    name,
    size = 'lg',
    followers,
    following = false,
    timeCreated,
    authorId,
    onFollowPress,
    showFollowButton = true,
    ...rest
  }: AuthorCardProps) => {
    // Check follow status
    const { data: isFollowing = following, isLoading: isCheckingFollow } =
      useIsFollowing(authorId);
    const { mutate: toggleFollow, isPending } = useToggleFollow();

    const handleFollowPress = () => {
      if (onFollowPress) {
        onFollowPress(!isFollowing);
      } else {
        toggleFollow(authorId);
      }
    };

    const authorName = name || 'Anonymous';
    const isLoading = isPending || isCheckingFollow;

    return (
      <Pressable
        style={styles.container}
        {...rest}
        accessibilityRole="button"
        accessibilityLabel={`${authorName}${followers ? `, ${formatNumber(followers)} followers` : ''}`}
        accessibilityHint="Tap to view author profile"
      >
        <Avatar
          source={avatar}
          size={size}
          editable={false}
          fallbackLabel={authorName.charAt(0)}
        />
        <View style={styles.content}>
          <Text
            variant={size === 'xs' ? 'caption' : 'body'}
            style={styles.name}
            numberOfLines={1}
          >
            {authorName}
          </Text>
          {followers !== undefined && (
            <Text style={styles.followers} numberOfLines={1}>
              {formatNumber(followers)} Followers
            </Text>
          )}
          {timeCreated !== undefined && (
            <Text style={styles.followers} numberOfLines={1}>
              {getTimeAgo(timeCreated)}
            </Text>
          )}
        </View>
        {size !== 'xs' && showFollowButton && (
          <Button
            leftIcon={!isFollowing ? AddOutline : undefined}
            variant={isFollowing ? 'primary' : 'outline'}
            size="xs"
            onPress={handleFollowPress}
            loading={isLoading}
            disabled={isLoading}
            accessibilityLabel={
              isFollowing ? 'Unfollow author' : 'Follow author'
            }
            accessibilityHint={
              isFollowing
                ? 'Tap to unfollow this author'
                : 'Tap to follow this author'
            }
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </Pressable>
    );
  },
);

AuthorCard.displayName = 'AuthorCard';

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'ios' && theme.shadow.sm),
  },
  content: {
    flex: 1,
  },
  name: {
    color: theme.colors.textPrimary,
    fontWeight: theme.fontWeight.semiBold,
  },
  followers: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
}));
