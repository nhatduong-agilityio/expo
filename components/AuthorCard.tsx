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
import { formatNumber } from '@/utils';

// Components
import { Avatar, Button, Text } from './ui';

export type AuthorCardProps = Omit<PressableProps, 'children'> & {
  avatar?: ImageSourcePropType | string | null;
  size?: 'xs' | 'lg';
  followers?: number;
  following?: boolean;
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
        accessibilityHint="Double tap to view author profile"
      >
        <Avatar
          source={avatar}
          size={size}
          editable={false}
          rounded={false}
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
        </View>
        {size !== 'xs' && showFollowButton && (
          <Button
            leftIcon={!isFollowing ? 'add' : undefined}
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
                ? 'Double tap to unfollow this author'
                : 'Double tap to follow this author'
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
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'ios' && theme.shadow.sm),
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
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
