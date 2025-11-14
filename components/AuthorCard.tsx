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
    ...rest
  }: AuthorCardProps) => {
    // Check follow status
    const { data: isFollowing = following } = useIsFollowing(authorId);
    const { mutate: toggleFollow, isPending } = useToggleFollow();

    const handleFollowPress = () => {
      if (onFollowPress) {
        onFollowPress(!isFollowing);
      } else {
        toggleFollow(authorId);
      }
    };

    return (
      <Pressable style={styles.container} {...rest}>
        <Avatar source={avatar} size={size} editable={false} />
        <View style={styles.content}>
          <Text
            variant={size === 'xs' ? 'caption' : 'body'}
            style={styles.name}
            numberOfLines={1}
          >
            {name ?? 'Anonymous'}
          </Text>
          {followers ? (
            <Text style={styles.followers} numberOfLines={1}>
              {formatNumber(followers ?? 0)} Followers
            </Text>
          ) : null}
        </View>
        {size !== 'xs' && (
          <Button
            leftIcon={!isFollowing ? 'add' : undefined}
            variant={isFollowing ? 'primary' : 'outline'}
            size="xs"
            onPress={handleFollowPress}
            loading={isPending}
            disabled={isPending}
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
    backgroundColor: 'transparent',
    ...(Platform.OS === 'ios' && theme.shadow.sm),
  },

  avatarWrapper: {
    marginBottom: theme.spacing.xs,
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  name: {
    color: theme.colors.textPrimary,
    fontWeight: theme.fontWeight.semiBold,
  },
  nameVertical: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  followers: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
}));
