import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { memo, useState } from 'react';
import { ImageSourcePropType, Platform, Pressable, View } from 'react-native';
import {
  StyleSheet,
  UnistylesVariants,
  useUnistyles,
} from 'react-native-unistyles';

// Constants
import { BLUR_HASH, DEFAULT_AVATAR } from '@/constants';

// Components
import { CameraOutline } from '../icons';
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
    size = 'xxl',
    fallbackLabel,
    rounded = true,
  }: AvatarProps) => {
    const { theme } = useUnistyles();
    const [imageUri, setImageUri] = useState<
      string | ImageSourcePropType | null
    >(source || null);

    styles.useVariants({ size, rounded: rounded });

    const handlePickImage = async () => {
      if (!editable) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
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
      // If we have an image source, show it
      if (imageUri) {
        const imageSource =
          typeof imageUri === 'string' ? { uri: imageUri } : imageUri;
        return (
          <Image
            source={imageSource}
            style={styles.image}
            contentFit="cover"
            transition={200}
            placeholder={{ blurhash: BLUR_HASH }}
            accessibilityIgnoresInvertColors
          />
        );
      }

      // If we have a fallback label, show it
      if (fallbackLabel) {
        return (
          <View style={styles.fallbackContainer}>
            <Text variant="button" style={styles.fallbackText}>
              {fallbackLabel}
            </Text>
          </View>
        );
      }

      // Otherwise show default avatar
      return (
        <Image
          source={DEFAULT_AVATAR}
          style={styles.image}
          contentFit="scale-down"
          transition={200}
          placeholder={{ blurhash: BLUR_HASH }}
          accessibilityIgnoresInvertColors
        />
      );
    };

    const accessibilityProps = editable
      ? {
          accessibilityRole: 'button' as const,
          accessibilityLabel: 'Change avatar',
          accessibilityHint: 'Opens the image library to select a new avatar',
        }
      : {
          accessibilityRole: 'image' as const,
          accessibilityLabel: fallbackLabel || 'Avatar',
          accessibilityHint: '',
        };

    return (
      <View testID="avatar-wrapper" style={styles.wrapper}>
        <Pressable
          style={({ pressed }) => [
            styles.container,
            pressed && editable && { opacity: theme.opacity.pressed },
          ]}
          onPress={editable ? handlePickImage : undefined}
          disabled={!editable}
          {...accessibilityProps}
        >
          {renderAvatar()}
        </Pressable>
        {editable && (
          <View style={styles.iconContainer}>
            <CameraOutline
              width={20}
              height={20}
              color={theme.colors.iconOnPrimary}
            />
          </View>
        )}
      </View>
    );
  },
);

Avatar.displayName = 'Avatar';

const styles = StyleSheet.create(theme => ({
  wrapper: {
    position: 'relative',
    variants: {
      size: {
        xs: { width: 20, height: 20 },
        sm: { width: 24, height: 24 },
        md: { width: 40, height: 40 },
        lg: { width: 70, height: 70 },
        xl: { width: 100, height: 100 },
        xxl: { width: 140, height: 140 },
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
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    variants: {
      size: {},
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
    variants: {
      size: {},
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
  fallbackContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      size: {},
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
    ...(Platform.OS === 'ios' && theme.shadow.sm),
  },
}));
