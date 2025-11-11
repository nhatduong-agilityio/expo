import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { BLUR_HASH, ROUTES } from '@/constants';

// Mock data
import { mockNews } from '@/mocks';

// Utils
import { formatNumber } from '@/utils';

// Components
import { AuthorCard, ScreenHeader } from '@/components';
import { Text } from '@/components/ui';

const PostDetailScreen = () => {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(24500);

  // Get post data from id
  const post = mockNews.find(p => p.id === id) || mockNews[0];

  const handleBackPress = () => {
    router.back();
  };

  const handleSharePress = () => {
    // TODO: Handle share press
  };

  const handleMenuPress = () => {
    //  TODO: Handle menu press
  };

  const handleLikePress = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));
  };

  const handleCommentPress = () => {
    // TODO: Handle comment press
  };

  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleAuthorPress = (authorId: string) => {
    router.push(ROUTES.AUTHOR_PROFILE(authorId));
  };

  const imageSource =
    typeof post.image === 'string' ? { uri: post.image } : post.image;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
      <View style={styles.header}></View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Author Info */}
        <View style={styles.authorSection}>
          <AuthorCard
            avatar={post.authorAvatar}
            name={post.authorName}
            followers={post.timeAgo}
            following={true}
            onPress={() => handleAuthorPress(post.authorId)}
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
          <Text style={styles.category}>{post.category}</Text>
        </View>

        {/* Title */}
        <Text variant="h2" style={styles.title}>
          {post.title}
        </Text>

        {/* Content */}
        <View style={styles.contentSection}>
          <Text variant="body" style={styles.paragraph}>
            Ukrainian President Volodymyr Zelensky has accused European
            countries that continue to buy Russian oil of &quot;earning their
            money in other people&apos;s blood&quot;.
          </Text>
          <Text variant="body" style={styles.paragraph}>
            In an interview with the BBC, President Zelensky singled out Germany
            and Hungary, accusing them of blocking efforts to embargo energy
            sales, from which Russia stands to make up to £250bn ($326bn) this
            year.
          </Text>
          <Text variant="body" style={styles.paragraph}>
            He said he was shocked by the response of some Western leaders, who
            he said were more interested in &quot;business as usual&quot; than
            in stopping the war.
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
                1K
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
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
}));

export default PostDetailScreen;
