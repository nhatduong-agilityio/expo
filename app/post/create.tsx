import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { BLUR_HASH } from '@/constants';

// Components
import { ScreenHeader } from '@/components';
import { Button, Input, Text } from '@/components/ui';

const CreatePostScreen = () => {
  const { theme } = useUnistyles();
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleMenuPress = () => {
    // TODO: Handle menu press
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      // TODO: Show error
      return;
    }

    setIsPublishing(true);
    // TODO: Implement publish logic

    setTimeout(() => {
      setIsPublishing(false);
      router.back();
    }, 1500);
  };

  const canPublish = title.trim().length > 0 && content.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <ScreenHeader
        title="Create News"
        leftIcon="arrow-back"
        rightIcon="ellipsis-vertical-sharp"
        onLeftPress={handleBackPress}
        onRightPress={handleMenuPress}
        showLeftIcon
        showRightIcon
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cover Photo */}
        <Pressable
          accessibilityRole="button"
          onPress={handlePickImage}
          style={styles.coverPhotoContainer}
        >
          {coverImage ? (
            <View style={styles.coverImageWrapper}>
              <Image
                source={{ uri: coverImage }}
                style={styles.coverImage}
                contentFit="cover"
                transition={200}
                placeholder={{ blurhash: BLUR_HASH }}
                accessibilityIgnoresInvertColors
              />
              <Pressable
                accessibilityRole="button"
                onPress={handlePickImage}
                style={styles.editImageButton}
                hitSlop={8}
              >
                <Ionicons
                  name="pencil"
                  size={20}
                  color={theme.colors.iconOnPrimary}
                />
              </Pressable>
            </View>
          ) : (
            <View style={styles.addCoverPhoto}>
              <Ionicons
                name="add"
                size={32}
                color={theme.colors.iconSecondary}
              />
              <Text variant="body" color="secondary">
                Add Cover Photo
              </Text>
            </View>
          )}
        </Pressable>

        {/* Title Input */}
        <Input
          accessibilityLabel="Text input field"
          styleContainer={styles.inputContainer}
          style={styles.titleInput}
          placeholder="News title"
          size="lg"
          value={title}
          onChangeText={setTitle}
          multiline
          textAlignVertical="top"
          accessibilityHint="Input field"
        />

        {/* Content Input */}
        <Input
          accessibilityLabel="Text input field"
          styleContainer={styles.inputContainer}
          style={styles.contentInput}
          placeholder="Add News/Article"
          value={content}
          size="md"
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          accessibilityHint="Input field"
        />

        {/* Formatting Toolbar */}
        <View style={styles.toolbar}>
          <Pressable
            accessibilityRole="button"
            style={styles.toolbarButton}
            hitSlop={8}
          >
            <Feather name="bold" size={20} color={theme.colors.iconPrimary} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.toolbarButton}
            hitSlop={8}
          >
            <Feather name="italic" size={20} color={theme.colors.iconPrimary} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.toolbarButton}
            hitSlop={8}
          >
            <AntDesign
              name="ordered-list"
              size={20}
              color={theme.colors.iconPrimary}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.toolbarButton}
            hitSlop={8}
          >
            <AntDesign
              name="unordered-list"
              size={20}
              color={theme.colors.iconPrimary}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.toolbarButton}
            hitSlop={8}
          >
            <AntDesign name="link" size={20} color={theme.colors.iconPrimary} />
          </Pressable>
        </View>

        {/* Bottom Toolbar */}
        <View style={styles.bottomToolbar}>
          <View style={styles.bottomToolbarLeft}>
            <Pressable
              accessibilityRole="button"
              style={styles.toolbarButton}
              hitSlop={8}
            >
              <Ionicons
                name="text"
                size={20}
                color={theme.colors.iconPrimary}
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.toolbarButton}
              hitSlop={8}
            >
              <MaterialCommunityIcons
                name="text-long"
                size={20}
                color={theme.colors.iconPrimary}
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.toolbarButton}
              hitSlop={8}
            >
              <Ionicons
                name="image-outline"
                size={20}
                color={theme.colors.iconPrimary}
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.toolbarButton}
              hitSlop={8}
            >
              <AntDesign
                name="ellipsis"
                size={20}
                color={theme.colors.iconPrimary}
              />
            </Pressable>
          </View>

          <Button
            variant="primary"
            size="md"
            onPress={handlePublish}
            loading={isPublishing}
            disabled={!canPublish || isPublishing}
          >
            Publish
          </Button>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing['3xl'],
  },
  coverPhotoContainer: {
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  addCoverPhoto: {
    height: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  coverImageWrapper: {
    position: 'relative',
    height: 200,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  editImageButton: {
    position: 'absolute',
    bottom: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.sm,
    ...theme.shadow.md,
  },
  inputContainer: {
    paddingHorizontal: theme.spacing.xl,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  titleInput: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  contentInput: {
    minHeight: 300,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 218,
    marginLeft: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    ...theme.shadow.md,
  },
  toolbarButton: {
    padding: theme.spacing.xs,
  },
  bottomToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  bottomToolbarLeft: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
}));

export default CreatePostScreen;
