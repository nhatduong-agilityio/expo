import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Platform, Pressable, PressableProps, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

// Constants
import { BLUR_HASH, DEFAULT_IMAGE, ROUTES } from '@/constants';

// Hooks

// Utils
import { formatNumber, getTimeAgo } from '@/utils';

// Types
import { News } from '@/types';

// Components
import { AuthorCard } from './AuthorCard';
import { MoreHorizontalOutline, TimeOutline } from './icons';
import { Text } from './ui';

export type PostCardProps = Omit<PressableProps, 'children'> & {
  post: News;
  variant?: 'vertical' | 'horizontal';
  following?: boolean;
  onFollowPress?: (following: boolean) => void;
  onMenuPress?: () => void;
};

export const PostCard = memo(
  ({
    post,
    variant = 'vertical',
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
      if (post.id) {
        router.push(ROUTES.POST_DETAIL(post.id));
      }
    };

    const handleAuthorPress = () => {
      router.push(ROUTES.AUTHOR_PROFILE(post.authorId));
    };

    const renderMenuButton = () => (
      <Pressable
        onPress={onMenuPress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="More options"
        accessibilityHint="Tap to open a menu with more options for this post"
      >
        <MoreHorizontalOutline width={14} height={14} />
      </Pressable>
    );

    const imageSource = {
      uri: post.featuredImageUrl ? post.featuredImageUrl : DEFAULT_IMAGE,
    };

    const accessibilityLabel = `${post.title} by ${post.author?.fullName || 'Unknown author'}. ${post.category?.name || 'Uncategorized'}. Posted ${getTimeAgo(post.createdAt)}. ${formatNumber(post.likesCount)} likes, ${formatNumber(post.commentsCount)} comments.`;

    const accessibilityProps = {
      accessibilityRole: 'button' as const,
      accessibilityLabel,
      accessibilityHint: 'Tap to read the full article',
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
            placeholder={{ blurhash: BLUR_HASH }}
            accessibilityIgnoresInvertColors
            accessible={false}
          />
          <View style={styles.contentHorizontal}>
            <Text
              style={styles.category}
              numberOfLines={1}
              accessibilityLabel={`Category: ${post.category?.name || 'Uncategorized'}`}
              accessibilityHint={`Category: ${post.category?.name || 'Uncategorized'}`}
            >
              {post.category?.name || 'Uncategorized'}
            </Text>
            <Text variant="body" style={styles.title} numberOfLines={2}>
              {post.title}
            </Text>
            <View style={styles.footer}>
              <View style={styles.authorInfo}>
                <AuthorCard
                  authorId={post.authorId}
                  avatar={post.author?.avatarUrl}
                  name={post.author?.fullName}
                  size="xs"
                  following={following}
                  onFollowPress={onFollowPress}
                  onPress={handleAuthorPress}
                />
              </View>
              <View style={styles.footerRight}>
                <View style={styles.timeContainer}>
                  <TimeOutline width={14} height={14} />
                  <Text
                    style={styles.timeAgo}
                    numberOfLines={1}
                    accessibilityLabel={`Posted ${getTimeAgo(post.createdAt)}`}
                    accessibilityHint={`Posted ${getTimeAgo(post.createdAt)}`}
                  >
                    {getTimeAgo(post.createdAt)}
                  </Text>
                </View>

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
          placeholder={{ blurhash: BLUR_HASH }}
          accessibilityIgnoresInvertColors
          accessible={false}
        />
        <View style={styles.contentVertical}>
          <Text
            style={styles.category}
            numberOfLines={1}
            accessibilityLabel={`Category: ${post.category?.name || 'Uncategorized'}`}
            accessibilityHint={`Category: ${post.category?.name || 'Uncategorized'}`}
          >
            {post.category?.name}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {post.title}
          </Text>
          <View style={styles.footer}>
            <View style={styles.authorInfo}>
              <AuthorCard
                authorId={post.authorId}
                avatar={post.author?.avatarUrl}
                name={post.author?.fullName}
                size="xs"
                following={following}
                onFollowPress={onFollowPress}
                onPress={handleAuthorPress}
              />
            </View>
            <View style={styles.footerRight}>
              <View style={styles.timeContainer}>
                <TimeOutline width={14} height={14} />
                <Text
                  style={styles.timeAgo}
                  numberOfLines={1}
                  accessibilityLabel={`Posted ${getTimeAgo(post.createdAt)}`}
                  accessibilityHint={`Posted ${getTimeAgo(post.createdAt)}`}
                >
                  {getTimeAgo(post.createdAt)}
                </Text>
              </View>
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
    ...(Platform.OS === 'ios' && theme.shadow.sm),
    variants: {
      variant: {
        vertical: {
          flexDirection: 'column',
        },
        horizontal: {
          flexDirection: 'row',
          gap: theme.spacing.sm,
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
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  contentHorizontal: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  actionButton: {
    padding: theme.spacing.xs,
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
  footerRight: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  timeAgo: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
  },
}));
