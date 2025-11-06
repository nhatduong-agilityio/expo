import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { memo, useState } from 'react';
import { ImageSourcePropType, Pressable, View } from 'react-native';
import {
  StyleSheet,
  UnistylesVariants,
  useUnistyles,
} from 'react-native-unistyles';
import { Text } from './Text';

type AvatarVariants = UnistylesVariants<typeof styles>;

export type AvatarProps = {
  source?: string | ImageSourcePropType | null;
  editable?: boolean;
  onChangeImage?: (uri: string) => void;
  size?: AvatarVariants['size'];
  fallbackLabel?: string;
  rounded?: boolean;
};

export const Avatar = memo(
  ({
    source,
    editable = false,
    onChangeImage,
    size = 'xl',
    fallbackLabel,
    rounded = true,
  }: AvatarProps) => {
    const { theme } = useUnistyles();
    const [imageUri, setImageUri] = useState<
      string | ImageSourcePropType | null
    >(source || null);

    styles.useVariants({ size, rounded: rounded || undefined });

    const handlePickImage = async () => {
      if (!editable) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [1, 1],
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
        const imageSource =
          typeof imageUri === 'string' ? { uri: imageUri } : imageUri;
        return (
          <Image
            source={imageSource}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        );
      }

      if (fallbackLabel) {
        return (
          <View style={styles.fallbackContainer}>
            <Text variant="button" style={styles.fallbackText}>
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
        disabled={!editable}
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
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    variants: {
      size: {
        xs: { width: 20, height: 20 },
        sm: { width: 24, height: 24 },
        md: { width: 40, height: 40 },
        lg: { width: 70, height: 70 },
        xl: { width: 140, height: 140 },
      },
      rounded: {
        true: {
          borderRadius: theme.borderRadius.full,
        },
        false: {
          borderRadius: theme.borderRadius.sm,
        },
      },
    },
  },
  image: {
    width: '100%',
    height: '100%',
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
  fallbackText: {
    color: theme.colors.textSecondary,
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
