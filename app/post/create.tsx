import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import {
  BLUR_HASH,
  CreatePostFormData,
  ROUTES,
  createPostSchema,
} from '@/constants';

// Hooks
import { useCategories, useCreateNews } from '@/hooks';

// Services
import { storageService } from '@/services';

// Components
import { ScreenHeader } from '@/components';
import { Button, Input, Text } from '@/components/ui';

const CreatePostScreen = () => {
  const { theme, rt } = useUnistyles();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch categories
  const { data: categories } = useCategories();

  // Create news mutation
  const { mutate: createNews, isPending } = useCreateNews();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      category_id: undefined,
      featured_image_url: '',
      status: 'draft',
    },
  });

  const coverImage = watch('featured_image_url');
  const selectedCategoryId = watch('category_id');

  const selectedCategory = categories?.find(
    cat => cat.id === selectedCategoryId,
  );

  const handleBackPress = () => {
    if (isDirty) {
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ],
      );
    } else {
      router.back();
    }
  };

  const handleMenuPress = () => {
    Alert.alert('Options', 'Choose an action', [
      {
        text: 'Save as Draft',
        onPress: () => handleSaveDraft(),
      },
      {
        text: 'Select Category',
        onPress: () => handleSelectCategory(),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handlePickImage = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your photo library.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setIsUploading(true);

        // Upload image to Supabase Storage
        const publicUrl = await storageService.uploadImage(
          {
            uri: result.assets[0].uri,
            type: result.assets[0].type || 'image/jpeg',
          },
          'news-images',
        );

        // Update form value
        setValue('featured_image_url', publicUrl, { shouldDirty: true });

        Alert.alert('Success', 'Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Upload Failed', 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectCategory = () => {
    if (!categories || categories.length === 0) {
      Alert.alert('No Categories', 'No categories available');
      return;
    }

    const categoryOptions = categories.map(cat => ({
      text: cat.name,
      onPress: () => setValue('category_id', cat.id, { shouldDirty: true }),
    }));

    Alert.alert('Select Category', 'Choose a category for your post', [
      ...categoryOptions,
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSaveDraft = handleSubmit(data => {
    const draftData = {
      ...data,
      status: 'draft' as const,
    };

    createNews(draftData, {
      onSuccess: () => {
        Alert.alert('Success', 'Draft saved successfully!', [
          {
            text: 'OK',
            onPress: () => router.replace(ROUTES.PROFILE),
          },
        ]);
      },
      onError: error => {
        console.error('Save draft error:', error);
        Alert.alert('Error', 'Failed to save draft. Please try again.');
      },
    });
  });

  const handlePublish = handleSubmit(data => {
    const publishData = {
      ...data,
      status: 'published' as const,
      excerpt: data.excerpt || data.content.substring(0, 200),
    };

    createNews(publishData, {
      onSuccess: () => {
        Alert.alert('Success', 'Your post has been published!', [
          {
            text: 'OK',
            onPress: () => router.replace(ROUTES.PROFILE),
          },
        ]);
      },
      onError: error => {
        console.error('Create post error:', error);
        Alert.alert('Error', 'Failed to publish post. Please try again.');
      },
    });
  });

  const isLoading = isPending || isUploading;

  return (
    <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
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
          disabled={isLoading}
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
                disabled={isLoading}
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

        {/* Category Selection */}
        {selectedCategory && (
          <View style={styles.categoryBadge}>
            <Text variant="bodySm" style={styles.categoryText}>
              Category: {selectedCategory.name}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                setValue('category_id', undefined, { shouldDirty: true })
              }
              hitSlop={8}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.iconSecondary}
              />
            </Pressable>
          </View>
        )}

        {/* Title Input */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              accessibilityLabel="Title input field"
              styleContainer={styles.inputContainer}
              style={styles.titleInput}
              placeholder="News title"
              size="lg"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.title?.message}
              multiline
              textAlignVertical="top"
              disabled={isLoading}
              accessibilityHint="Enter the title of your news article"
            />
          )}
        />

        {/* Content Input */}
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              accessibilityLabel="Content input field"
              styleContainer={styles.inputContainer}
              style={styles.contentInput}
              placeholder="Write your news article here..."
              value={value}
              size="md"
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.content?.message}
              multiline
              textAlignVertical="top"
              disabled={isLoading}
              accessibilityHint="Enter the content of your news article"
            />
          )}
        />

        {/* Formatting Toolbar */}
        <View style={styles.toolbar}>
          <Pressable
            accessibilityRole="button"
            style={styles.toolbarButton}
            hitSlop={8}
            disabled={isLoading}
          >
            <Feather name="bold" size={20} color={theme.colors.iconPrimary} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.toolbarButton}
            hitSlop={8}
            disabled={isLoading}
          >
            <Feather name="italic" size={20} color={theme.colors.iconPrimary} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.toolbarButton}
            hitSlop={8}
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              onPress={handlePickImage}
              disabled={isLoading}
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
              onPress={handleSelectCategory}
              disabled={isLoading}
            >
              <Ionicons
                name="pricetag-outline"
                size={20}
                color={theme.colors.iconPrimary}
              />
            </Pressable>
          </View>

          <Button
            variant="primary"
            size="md"
            onPress={handlePublish}
            loading={isLoading}
            disabled={isLoading}
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
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semiBold,
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
  errorContainer: {
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.errorLight,
    borderRadius: theme.borderRadius.sm,
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
