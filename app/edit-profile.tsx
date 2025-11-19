import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { ProfileFormData, profileSchema } from '@/constants';

// Hooks
import { useUpdateProfile } from '@/hooks';

// Services
import { storageService } from '@/services';

// Stores
import { useAuthStore } from '@/stores';

// Components
import { ScreenHeader } from '@/components';
import { CheckOutline, CloseOutline } from '@/components/icons';
import { Avatar, Input } from '@/components/ui';

const EditProfileScreen = () => {
  const router = useRouter();
  const { rt } = useUnistyles();
  const { profile } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.fullName || '',
      email: profile?.email || '',
      phone_number: profile?.phoneNumber || '',
      bio: profile?.bio || '',
      website: profile?.website || '',
      avatar_url: profile?.avatarUrl || '',
    },
  });

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

  const handleSavePress = handleSubmit(data => {
    updateProfile(data, {
      onSuccess: () => {
        Alert.alert('Success', 'Profile updated successfully!', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      },
      onError: error => {
        console.error('Update profile error:', error);
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      },
    });
  });

  const handleAvatarChange = async (uri: string) => {
    try {
      setIsUploading(true);

      // Upload image to Supabase Storage
      const publicUrl = await storageService.uploadImage(
        {
          uri,
          type: 'image/jpeg',
        },
        'avatars',
      );

      // Update form value
      setValue('avatar_url', publicUrl, { shouldDirty: true });

      Alert.alert('Success', 'Avatar uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert(
        'Upload Failed',
        'Failed to upload avatar. Please try again.',
      );
    } finally {
      setIsUploading(false);
    }
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
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        await handleAvatarChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const isLoading = isPending || isUploading;

  return (
    <SafeAreaView style={styles.container} edges={['top']} key={rt.themeName}>
      {/* Header */}
      <ScreenHeader
        title="Edit Profile"
        leftIcon={CloseOutline}
        rightIcon={CheckOutline}
        onLeftPress={handleBackPress}
        onRightPress={handleSavePress}
        showLeftIcon
        showRightIcon
      />

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Controller
            control={control}
            name="avatar_url"
            render={({ field: { value } }) => (
              <Avatar
                source={value || null}
                size="xl"
                editable
                onChangeImage={handlePickImage}
                fallbackLabel={profile?.fullName?.charAt(0) || 'U'}
              />
            )}
          />
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.username?.message}
                placeholder="Username"
                autoCapitalize="none"
                disabled={isLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="full_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.full_name?.message}
                placeholder="Full Name"
                disabled={isLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value } }) => (
              <Input
                label="Email Address"
                required
                value={value}
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                disabled
                editable={false}
              />
            )}
          />

          <Controller
            control={control}
            name="phone_number"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Phone Number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone_number?.message}
                placeholder="+1234567890"
                keyboardType="phone-pad"
                disabled={isLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Bio"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.bio?.message}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={3}
                disabled={isLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="website"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Website"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.website?.message}
                placeholder="https://yourwebsite.com"
                keyboardType="url"
                autoCapitalize="none"
                disabled={isLoading}
              />
            )}
          />
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
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  form: {
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
}));

export default EditProfileScreen;
