import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { BLUR_HASH, ROUTES } from '@/constants';

// Hooks
import {
  useIncrementViewCount,
  useIsBookmarked,
  useIsLiked,
  useNewsDetail,
  useToggleBookmark,
  useToggleLike,
} from '@/hooks';

// Utils
import { formatNumber } from '@/utils';

// Components
import { AuthorCard, ScreenHeader } from '@/components';
import {
  BackOutline,
  BookmarkFilled,
  BookmarkOutline,
  CommentOutline,
  HeartFilled,
  HeartOutline,
  MoreVerticalOutline,
  ShareOutline,
} from '@/components/icons';
import { Text } from '@/components/ui';

const PostDetailScreen = () => {
  const { theme, rt } = useUnistyles();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch post data
  const { data: post, isLoading } = useNewsDetail(id!);

  // Check bookmark and like status
  const { data: isBookmarked = post?.isBookmarked || false } = useIsBookmarked(
    id!,
  );
  const { data: isLiked = post?.isLiked || false } = useIsLiked(id!);

  // Mutations
  const { mutate: incrementView } = useIncrementViewCount();
  const { mutate: toggleBookmark, isPending: isBookmarkPending } =
    useToggleBookmark();
  const { mutate: toggleLike, isPending: isLikePending } = useToggleLike();

  useEffect(() => {
    if (id) {
      // Increment view count when post is loaded
      incrementView(id);
    }
  }, [id, incrementView]);

  const handleBackPress = () => {
    router.back();
  };

  const handleSharePress = () => {
    // TODO: Implement share functionality
  };

  const handleMenuPress = () => {
    // TODO: Implement menu
  };

  const handleLikePress = () => {
    toggleLike(id!);
  };

  const handleCommentPress = () => {
    // TODO: Navigate to comments
  };

  const handleBookmarkPress = () => {
    toggleBookmark(id!);
  };

  const handleAuthorPress = (authorId: string) => {
    router.push(ROUTES.AUTHOR_PROFILE(authorId));
  };

  if (isLoading || !post) {
    return (
      <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
        <ScreenHeader
          title=""
          leftIcon={BackOutline}
          onLeftPress={handleBackPress}
          showLeftIcon
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const imageSource = {
    uri: post.featuredImageUrl ?? 'https://picsum.photos/100/100',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
      {/* Header */}
      <ScreenHeader
        title=""
        leftIcon={BackOutline}
        rightComponent={
          <View style={styles.headerActions}>
            <Pressable
              onPress={handleSharePress}
              hitSlop={8}
              style={styles.headerButton}
              accessibilityRole="button"
              accessibilityLabel="Share post"
              accessibilityHint="Press to share post"
            >
              <ShareOutline />
            </Pressable>
            <Pressable
              onPress={handleMenuPress}
              hitSlop={8}
              style={styles.headerButton}
              accessibilityRole="button"
              accessibilityLabel="More options"
              accessibilityHint="Press to open more options"
            >
              <MoreVerticalOutline />
            </Pressable>
          </View>
        }
        onLeftPress={handleBackPress}
        showLeftIcon
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Author Info */}
        <View style={styles.authorSection}>
          <AuthorCard
            avatar={post.author?.avatarUrl || 'https://picsum.photos/100/100'}
            name={post.author?.fullName || 'Anonymous'}
            timeCreated={post.createdAt}
            following={false}
            size="md"
            authorId={post.authorId}
            onPress={() => handleAuthorPress(post.authorId)}
          />
        </View>

        {/* Featured Image */}
        <View style={styles.featuredImageContainer}>
          <Image
            source={imageSource}
            style={styles.featuredImage}
            contentFit="cover"
            transition={200}
            placeholder={{ blurhash: BLUR_HASH }}
            accessibilityIgnoresInvertColors
          />
        </View>

        {/* Category */}
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>
            {post.category?.name || 'Uncategorized'}
          </Text>
        </View>

        {/* Title */}
        <Text variant="h2" style={styles.title}>
          {post.title}
        </Text>

        {/* Content */}
        <View style={styles.contentSection}>
          <Text variant="body" style={styles.paragraph}>
            {post.content}
          </Text>
        </View>
      </ScrollView>
      {/* Engagement Actions */}
      <View style={styles.engagementSection}>
        <View style={styles.engagementLeft}>
          <Pressable
            onPress={handleLikePress}
            style={styles.engagementButton}
            hitSlop={8}
            disabled={isLikePending}
            accessibilityRole="button"
            accessibilityLabel={isLiked ? 'Unlike post' : 'Like post'}
            accessibilityHint={isLiked ? 'Unlikes the post' : 'Likes the post'}
          >
            {isLiked ? (
              <HeartFilled color={theme.colors.error} />
            ) : (
              <HeartOutline />
            )}

            <Text variant="body" style={styles.engagementText}>
              {formatNumber(post.likesCount)}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleCommentPress}
            style={styles.engagementButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="View comments"
            accessibilityHint="Press to view comments"
          >
            <CommentOutline />
            <Text variant="body" style={styles.engagementText}>
              {formatNumber(post.commentsCount)}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleBookmarkPress}
          style={styles.bookmarkButton}
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
          {isBookmarked ? (
            <BookmarkFilled color={theme.colors.iconOnActive} />
          ) : (
            <BookmarkOutline />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  scrollContent: {
    paddingBottom: theme.spacing['3xl'],
  },
  authorSection: {
    paddingBottom: theme.spacing.md,
  },
  featuredImageContainer: {
    position: 'relative',
    height: 248,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  categoryContainer: {
    paddingTop: theme.spacing.lg,
  },
  category: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  title: {
    paddingTop: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  contentSection: {
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  paragraph: {
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.lg,
  },
  engagementSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    ...(Platform.OS === 'ios' && theme.shadow.md),
  },
  engagementLeft: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
    alignItems: 'center',
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  engagementText: {
    color: theme.colors.textPrimary,
  },
  bookmarkButton: {
    padding: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default PostDetailScreen;
