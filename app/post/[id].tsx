import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
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
import { formatNumber, getTimeAgo } from '@/utils';

// Components
import { AuthorCard, ScreenHeader } from '@/components';
import { Text } from '@/components/ui';

const PostDetailScreen = () => {
  const { theme, rt } = useUnistyles();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch post data
  const { data: post, isLoading } = useNewsDetail(id!);

  // Check if liked/bookmarked
  const { data: isLikedData } = useIsLiked(id!);
  const { data: isBookmarkedData } = useIsBookmarked(id!);

  // Mutations
  const { mutate: toggleLike } = useToggleLike();
  const { mutate: toggleBookmark } = useToggleBookmark();
  const { mutate: incrementView } = useIncrementViewCount();

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (isLikedData !== undefined) {
      setIsLiked(isLikedData);
    }
  }, [isLikedData]);

  useEffect(() => {
    if (isBookmarkedData !== undefined) {
      setIsBookmarked(isBookmarkedData);
    }
  }, [isBookmarkedData]);

  useEffect(() => {
    if (post) {
      setLikesCount(post.likes_count);
      // Increment view count when post is loaded
      incrementView(post.id);
    }
  }, [post]);

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
    setIsLiked(!isLiked);
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));
    toggleLike(id!);
  };

  const handleCommentPress = () => {
    // TODO: Navigate to comments
  };

  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
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
          leftIcon="arrow-back"
          onLeftPress={handleBackPress}
          showLeftIcon
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const imageSource = post.featured_image_url
    ? { uri: post.featured_image_url }
    : require('@/assets/images/react-logo.png');

  return (
    <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
      {/* Header */}
      <ScreenHeader
        title=""
        leftIcon="arrow-back"
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
              <Ionicons
                name="share-social-outline"
                size={24}
                color={theme.colors.iconPrimary}
              />
            </Pressable>
            <Pressable
              onPress={handleMenuPress}
              hitSlop={8}
              style={styles.headerButton}
              accessibilityRole="button"
              accessibilityLabel="More options"
              accessibilityHint="Press to open more options"
            >
              <Ionicons
                name="ellipsis-vertical"
                size={24}
                color={theme.colors.iconPrimary}
              />
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
            avatar={post.author?.avatar_url || 'https://picsum.photos/100/100'}
            name={post.author?.full_name || 'Anonymous'}
            followers={getTimeAgo(post.published_at || post.created_at)}
            following={false}
            onPress={() => handleAuthorPress(post.author_id)}
          />
        </View>

        {/* Featured Image */}
        <Image
          source={imageSource}
          style={styles.featuredImage}
          contentFit="cover"
          transition={200}
          placeholder={{ blurhash: BLUR_HASH }}
          accessibilityIgnoresInvertColors
        />

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

        {/* Engagement Actions */}
        <View style={styles.engagementSection}>
          <View style={styles.engagementLeft}>
            <Pressable
              onPress={handleLikePress}
              style={styles.engagementButton}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={isLiked ? 'Unlike post' : 'Like post'}
              accessibilityHint={
                isLiked ? 'Unlikes the post' : 'Likes the post'
              }
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={isLiked ? theme.colors.error : theme.colors.iconPrimary}
              />
              <Text variant="body" style={styles.engagementText}>
                {formatNumber(likesCount)}
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
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={theme.colors.iconPrimary}
              />
              <Text variant="body" style={styles.engagementText}>
                {formatNumber(post.comments_count)}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleBookmarkPress}
            style={styles.bookmarkButton}
            hitSlop={8}
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
              size={24}
              color={
                isBookmarked ? theme.colors.primary : theme.colors.iconPrimary
              }
            />
          </Pressable>
        </View>
      </ScrollView>
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
  },
  scrollContent: {
    paddingBottom: theme.spacing['3xl'],
  },
  authorSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  featuredImage: {
    width: '100%',
    height: 400,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  categoryContainer: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  category: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  title: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  contentSection: {
    paddingHorizontal: theme.spacing.xl,
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
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  engagementLeft: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
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
