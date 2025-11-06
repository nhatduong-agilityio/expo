import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps, memo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  View,
} from 'react-native';
import { StyleSheet, UnistylesVariants } from 'react-native-unistyles';

type FloatButtonVariants = UnistylesVariants<typeof styles>;

export type FloatButtonProps = Omit<PressableProps, 'children'> & {
  iconName?: ComponentProps<typeof Ionicons>['name'];
  size?: 'sm' | 'md' | 'lg';
  variant?: FloatButtonVariants['variant'];
  disabled?: boolean;
  loading?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
};

export const FloatButton = memo(
  ({
    iconName = 'add',
    size = 'md',
    variant = 'primary',
    disabled = false,
    loading = false,
    position = 'bottom-right',
    ...rest
  }: FloatButtonProps) => {
    styles.useVariants({
      size,
      variant,
      disabled: disabled || loading || undefined,
      position,
    });

    const renderContent = () => {
      if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={styles.loading.color} size="small" />
          </View>
        );
      }

      return (
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={24} color="white" />
        </View>
      );
    };

    return (
      <Pressable
        style={({ pressed }) => [
          styles.container,
          pressed && !disabled && !loading && styles.pressed,
        ]}
        disabled={disabled || loading}
        {...rest}
      >
        {renderContent()}
      </Pressable>
    );
  },
);

FloatButton.displayName = 'FloatButton';

const styles = StyleSheet.create(theme => ({
  container: {
    position: 'absolute',
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.lg,
    variants: {
      size: {
        sm: {
          width: 44,
          height: 44,
        },
        md: {
          width: 54,
          height: 54,
        },
        lg: {
          width: 64,
          height: 64,
        },
      },
      variant: {
        primary: {
          backgroundColor: theme.colors.buttonPrimary,
        },
        secondary: {
          backgroundColor: theme.colors.buttonSecondary,
        },
        destructive: {
          backgroundColor: theme.colors.error,
        },
      },
      disabled: {
        true: {
          backgroundColor: theme.colors.buttonDisabled,
          opacity: theme.opacity.disabled,
        },
      },
      position: {
        'bottom-right': {
          bottom: theme.spacing.xl,
          right: theme.spacing.xl,
        },
        'bottom-left': {
          bottom: theme.spacing.xl,
          left: theme.spacing.xl,
        },
        'top-right': {
          top: theme.spacing.xl,
          right: theme.spacing.xl,
        },
        'top-left': {
          top: theme.spacing.xl,
          left: theme.spacing.xl,
        },
      },
    },
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      variant: {
        primary: {
          color: theme.colors.iconOnPrimary,
        },
        secondary: {
          color: theme.colors.iconPrimary,
        },
        destructive: {
          color: theme.colors.iconOnPrimary,
        },
      },
    },
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    variants: {
      variant: {
        primary: {
          color: theme.colors.textOnPrimary,
        },
        secondary: {
          color: theme.colors.textPrimary,
        },
        destructive: {
          color: theme.colors.textOnPrimary,
        },
        default: {
          color: theme.colors.textPrimary,
        },
      },
    },
  },
}));
