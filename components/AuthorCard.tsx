import { memo } from 'react';
import {
  ImageSourcePropType,
  Pressable,
  PressableProps,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Avatar, Button, Text } from './ui';

export type AuthorCardProps = Omit<PressableProps, 'children'> & {
  avatar: ImageSourcePropType | string;
  name: string;
  size?: 'xs' | 'lg';
  followers?: string;
  following?: boolean;
  onFollowPress?: (following: boolean) => void;
};

export const AuthorCard = memo(
  ({
    avatar,
    name,
    size = 'lg',
    followers,
    following = false,
    onFollowPress,
    ...rest
  }: AuthorCardProps) => {
    const handleFollowPress = () => {
      onFollowPress?.(!following);
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
            {name}
          </Text>
          {followers && (
            <Text style={styles.followers} numberOfLines={1}>
              {followers}
            </Text>
          )}
        </View>
        {size !== 'xs' && (
          <Button
            leftIcon={!following ? 'add' : undefined}
            variant={following ? 'primary' : 'outline'}
            size="xs"
            onPress={handleFollowPress}
          >
            {following ? 'Following' : 'Follow'}
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
    ...theme.shadow.sm,
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
