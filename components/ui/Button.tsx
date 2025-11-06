import { memo, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  View,
} from 'react-native';
import { StyleSheet, UnistylesVariants } from 'react-native-unistyles';
import { Text } from './Text';

type ButtonVariants = UnistylesVariants<typeof styles>;

export type ButtonProps = Omit<PressableProps, 'children'> & {
  variant?: ButtonVariants['variant'];
  size?: 'md' | 'sm' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const Button = memo(
  ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    children,
    leftIcon,
    rightIcon,
    ...rest
  }: ButtonProps) => {
    styles.useVariants({
      variant,
      size,
      fullWidth: fullWidth || undefined,
      disabled: disabled || loading || undefined,
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
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text variant="button" style={styles.text}>
            {children}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
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

Button.displayName = 'Button';

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.buttonPrimary,
        },
        secondary: {
          backgroundColor: theme.colors.buttonSecondary,
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.borderFocus,
        },
        ghost: {
          backgroundColor: 'transparent',
        },
        destructive: {
          backgroundColor: theme.colors.error,
        },
      },
      size: {
        sm: {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          minHeight: 36,
        },
        md: {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          minHeight: 48,
        },
        lg: {
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.lg,
          minHeight: 56,
        },
      },
      fullWidth: {
        true: {
          width: '100%',
        },
      },
      disabled: {
        true: {
          backgroundColor: theme.colors.buttonDisabled,
          borderColor: theme.colors.border,
          opacity: theme.opacity.disabled,
        },
      },
    },
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  leftIcon: {
    marginRight: theme.spacing.xs,
  },
  rightIcon: {
    marginLeft: theme.spacing.xs,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    variants: {
      variant: {
        primary: {
          color: theme.colors.textOnPrimary,
        },
        secondary: {
          color: theme.colors.textPrimary,
        },
        outline: {
          color: theme.colors.primary,
        },
        ghost: {
          color: theme.colors.primary,
        },
        destructive: {
          color: theme.colors.textOnPrimary,
        },
        default: {
          color: theme.colors.textPrimary,
        },
      },
      disabled: {
        true: {
          color: theme.colors.textDisabled,
        },
      },
    },
  },
  loading: {
    variants: {
      variant: {
        primary: {
          color: theme.colors.textOnPrimary,
        },
        destructive: {
          color: theme.colors.textOnPrimary,
        },
        outline: {
          color: theme.colors.primary,
        },
        ghost: {
          color: theme.colors.primary,
        },
        secondary: {
          color: theme.colors.textPrimary,
        },
        default: {
          color: theme.colors.textPrimary,
        },
      },
    },
  },
}));
