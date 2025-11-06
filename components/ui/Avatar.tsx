import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { memo, useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  StyleSheet,
  UnistylesVariants,
  useUnistyles,
} from 'react-native-unistyles';
import { Text } from './Text';

type AvatarVariants = UnistylesVariants<typeof styles>;

export type AvatarProps = {
  source?: string | null;
  editable?: boolean;
  onChangeImage?: (uri: string) => void;
  size?: AvatarVariants['size'];
  fallbackLabel?: string;
};

export const Avatar = memo(
  ({
    source,
    editable = false,
    onChangeImage,
    size = 'xl',
    fallbackLabel,
  }: AvatarProps) => {
    const { theme } = useUnistyles();
    const [imageUri, setImageUri] = useState<string | null>(source || null);

    styles.useVariants({ size });

    const handlePickImage = async () => {
      if (!editable) return;

      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        onChangeImage?.(uri);
      }
    };

    const renderAvatar = () => {
      if (imageUri) {
        return (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        );
      }

      if (fallbackLabel) {
        return (
          <View style={styles.fallbackContainer}>
            <Text variant="button" color="secondary">
              {fallbackLabel}
            </Text>
          </View>
        );
      }

      return <View style={styles.placeholder} />;
    };

    return (
      <Pressable
        style={({ pressed }) => [
          styles.container,
          pressed && editable && { opacity: theme.opacity.pressed },
        ]}
        onPress={editable ? handlePickImage : undefined}
      >
        {renderAvatar()}
        {editable && (
          <View style={styles.iconContainer}>
            <Ionicons
              name="camera"
              size={20}
              color={theme.colors.iconOnPrimary}
            />
          </View>
        )}
      </Pressable>
    );
  },
);

Avatar.displayName = 'Avatar';

const styles = StyleSheet.create(theme => ({
  container: {
    position: 'relative',
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      size: {
        sm: { width: 24, height: 24 },
        md: { width: 40, height: 40 },
        lg: { width: 70, height: 70 },
        xl: { width: 140, height: 140 },
      },
    },
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  placeholder: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
  },
  fallbackContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    padding: 6,
    ...theme.shadow.sm,
  },
}));
