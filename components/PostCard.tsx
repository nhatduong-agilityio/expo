import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { BLUR_HASH, DEFAULT_AVATAR, ROUTES } from '@/constants';

// Hooks
import { useOptimisticBookmark, useOptimisticLike } from '@/hooks';

// Utils
import { getTimeAgo } from '@/utils';

// Types
import { News } from '@/types';

// Components
import { AuthorCard } from './AuthorCard';
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
    const { theme } = useUnistyles();

    // Optimistic bookmark
    const {
      isBookmarked,
      isPending: isBookmarkPending,
      toggleBookmark,
    } = useOptimisticBookmark(post.id, post.isBookmarked);

    // Optimistic like
    const {
      isLiked,
      likesCount,
      isPending: isLikePending,
      toggleLike,
    } = useOptimisticLike(post.id, post.isLiked, post.likesCount);

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

    const handleBookmarkPress = (e: any) => {
      e.stopPropagation();
      toggleBookmark();
    };

    const handleLikePress = (e: any) => {
      e.stopPropagation();
      toggleLike();
    };

    const renderActions = () => (
      <View style={styles.actions}>
        <Pressable
          onPress={handleLikePress}
          style={styles.actionButton}
          hitSlop={8}
          disabled={isLikePending}
          accessibilityRole="button"
          accessibilityLabel={isLiked ? 'Unlike post' : 'Like post'}
          accessibilityHint={isLiked ? 'Unlikes the post' : 'Likes the post'}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={isLiked ? theme.colors.error : theme.colors.iconSecondary}
            style={[isLikePending && { opacity: theme.opacity.disabled }]}
          />
        </Pressable>

        <Pressable
          onPress={handleBookmarkPress}
          style={styles.actionButton}
          hitSlop={8}
          disabled={isBookmarkPending}
          accessibilityRole="button"
          accessibilityLabel={
            isBookmarked ? 'Remove bookmark' : 'Bookmark post'
          }
          accessibilityHint={
            isBookmarked
              ? 'Removes the post from bookmarks'
              : 'Bookmarks the post'
          }
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={
              isBookmarked ? theme.colors.primary : theme.colors.iconSecondary
            }
            style={[isBookmarkPending && { opacity: theme.opacity.disabled }]}
          />
        </Pressable>
      </View>
    );

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

    const imageSource =
      typeof post.featuredImageUrl === 'string'
        ? { uri: post.featuredImageUrl }
        : DEFAULT_AVATAR;
    const accessibilityProps = {
      accessibilityRole: 'button' as const,
      accessibilityLabel: `${post.title} by ${post.author?.fullName}`,
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
            placeholder={{ blurhash: BLUR_HASH }}
            accessibilityIgnoresInvertColors
          />
          <View style={styles.contentHorizontal}>
            <View style={styles.headerRow}>
              <Text style={styles.category} numberOfLines={1}>
                {post.category?.name}
              </Text>
              {renderActions()}
            </View>
            <Text variant="body" style={styles.title} numberOfLines={2}>
              {post.title}
            </Text>
            <View style={styles.footer}>
              <View style={styles.authorInfo}>
                <AuthorCard
                  authorId={post.authorId}
                  avatar={post.author?.avatarUrl || DEFAULT_AVATAR}
                  name={post.author?.fullName || 'Unknown'}
                  size="xs"
                  following={following}
                  onFollowPress={onFollowPress}
                  onPress={handleAuthorPress}
                />
              </View>
              <View style={styles.footerRight}>
                <View style={styles.timeContainer}>
                  <Ionicons name="time-outline" size={14} />
                  <Text style={styles.timeAgo} numberOfLines={1}>
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
        />
        <View style={styles.contentVertical}>
          <View style={styles.headerRow}>
            <Text style={styles.category} numberOfLines={1}>
              {post.category?.name}
            </Text>
            {renderActions()}
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {post.title}
          </Text>
          <View style={styles.footer}>
            <View style={styles.authorInfo}>
              <AuthorCard
                authorId={post.authorId}
                avatar={post.author?.avatarUrl || DEFAULT_AVATAR}
                name={post.author?.fullName || 'Unknown'}
                size="xs"
                following={following}
                onFollowPress={onFollowPress}
                onPress={handleAuthorPress}
              />
            </View>
            <View style={styles.footerRight}>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={14} />
                <Text style={styles.timeAgo} numberOfLines={1}>
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
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  contentHorizontal: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  menuIcon: {
    color: theme.colors.iconSecondary,
    fontFamily: theme.fontFamily.bold,
    letterSpacing: 1,
  },
}));
