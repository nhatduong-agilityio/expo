import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import {
  ImageSourcePropType,
  Pressable,
  PressableProps,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

// Constants
import { BLUR_HASH, ROUTES } from '@/constants';

// Components
import { AuthorCard } from './AuthorCard';
import { Text } from './ui';

export type PostCardProps = Omit<PressableProps, 'children'> & {
  id?: string;
  variant?: 'vertical' | 'horizontal';
  image: ImageSourcePropType | string;
  category: string;
  title: string;
  authorAvatar: ImageSourcePropType | string;
  authorName: string;
  authorId: string;
  timeAgo: string;
  following?: boolean;
  onFollowPress?: (following: boolean) => void;
  onMenuPress?: () => void;
};

export const PostCard = memo(
  ({
    id,
    variant = 'vertical',
    image,
    category,
    title,
    authorAvatar,
    authorName,
    authorId,
    timeAgo,
    following = false,
    onFollowPress,
    onMenuPress,
    ...rest
  }: PostCardProps) => {
    const router = useRouter();

    styles.useVariants({
      variant,
    });

    const handlePress = () => {
      if (id) {
        router.push(ROUTES.POST_DETAIL(id));
      }
    };

    const handleAuthorPress = () => {
      router.push(ROUTES.AUTHOR_PROFILE(authorId));
    };

    const renderMenuButton = () => (
      <Pressable
        onPress={onMenuPress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="More options"
        accessibilityHint="Opens a menu with more options for this post"
      >
        <Ionicons
          style={styles.menuIcon}
          name="ellipsis-horizontal"
          size={14}
        />
      </Pressable>
    );

    const imageSource = typeof image === 'string' ? { uri: image } : image;
    const accessibilityProps = {
      accessibilityRole: 'button' as const,
      accessibilityLabel: `${title} by ${authorName}`,
      accessibilityHint: 'Opens the post details',
    };

    if (variant === 'horizontal') {
      return (
        <Pressable
          style={styles.container}
          onPress={handlePress}
          {...accessibilityProps}
          {...rest}
        >
          <Image
            source={imageSource}
            style={styles.imageHorizontal}
            contentFit="cover"
            transition={200}
            placeholder={{ blurhash: BLUR_HASH }}
            accessibilityIgnoresInvertColors
          />
          <View style={styles.contentHorizontal}>
            <Text style={styles.category} numberOfLines={1}>
              {category}
            </Text>
            <Text variant="body" style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.footer}>
              <View style={styles.authorInfo}>
                <AuthorCard
                  avatar={authorAvatar}
                  name={authorName}
                  size="xs"
                  following={following}
                  onFollowPress={onFollowPress}
                  onPress={handleAuthorPress}
                />
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeAgo} numberOfLines={1}>
                  {timeAgo}
                </Text>
                {renderMenuButton()}
              </View>
            </View>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        style={styles.container}
        onPress={handlePress}
        {...accessibilityProps}
        {...rest}
      >
        <Image
          source={imageSource}
          style={styles.imageVertical}
          contentFit="cover"
          transition={200}
          placeholder={{ blurhash: BLUR_HASH }}
          accessibilityIgnoresInvertColors
        />
        <View style={styles.contentVertical}>
          <Text style={styles.category} numberOfLines={1}>
            {category}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.footer}>
            <View style={styles.authorInfo}>
              <AuthorCard
                avatar={authorAvatar}
                name={authorName}
                size="xs"
                following={following}
                onFollowPress={onFollowPress}
                onPress={handleAuthorPress}
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeAgo} numberOfLines={1}>
                {timeAgo}
              </Text>
              {renderMenuButton()}
            </View>
          </View>
        </View>
      </Pressable>
    );
  },
);

PostCard.displayName = 'PostCard';

const styles = StyleSheet.create(theme => ({
  container: {
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    ...theme.shadow.sm,
    variants: {
      variant: {
        vertical: {
          flexDirection: 'column',
        },
        horizontal: {
          flexDirection: 'row',
          gap: theme.spacing.xs,
          alignItems: 'center',
        },
      },
    },
  },
  imageVertical: {
    width: '100%',
    height: 183,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.sm,
  },
  imageHorizontal: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  contentVertical: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  contentHorizontal: {
    flex: 1,
  },
  category: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  title: {
    color: theme.colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  authorInfo: {
    flex: 1,
    alignItems: 'center',
  },
  timeContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeAgo: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
  },
  menuIcon: {
    color: theme.colors.iconSecondary,
    fontFamily: theme.fontFamily.bold,
    letterSpacing: 1,
  },
}));
