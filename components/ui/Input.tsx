import { memo, ReactNode, useState } from 'react';
import { Pressable, TextInput, TextInputProps, View } from 'react-native';
import {
  StyleSheet,
  UnistylesVariants,
  useUnistyles,
} from 'react-native-unistyles';
import { Text } from './Text';

type InputVariants = UnistylesVariants<typeof styles>;

export type InputProps = Omit<TextInputProps, 'placeholderTextColor'> & {
  variant?: 'primary' | 'error';
  size?: InputVariants['size'];
  label?: string;
  error?: string;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClear?: () => void;
  showClearButton?: boolean;
};

export const Input = memo(
  ({
    variant = 'primary',
    size = 'medium',
    label,
    error,
    disabled = false,
    leftIcon,
    rightIcon,
    onClear,
    showClearButton = false,
    value,
    onFocus,
    onBlur,
    ...rest
  }: InputProps) => {
    const { theme } = useUnistyles();
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;

    styles.useVariants({
      variant: error ? 'error' : variant,
      size,
      disabled: disabled || undefined,
      focused: isFocused || undefined,
      hasLeftIcon: !!leftIcon || undefined,
      hasRightIcon: !!rightIcon || showClearButton || undefined,
    });

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const showClear = showClearButton && hasValue && !disabled && isFocused;

    return (
      <View style={styles.wrapper}>
        {label && (
          <Text
            variant="label"
            color={disabled ? 'disabled' : error ? 'error' : 'primary'}
            style={styles.label}
          >
            {label}
          </Text>
        )}

        <View style={styles.container}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

          <TextInput
            style={styles.input}
            placeholderTextColor={theme.colors.textPlaceholder}
            editable={!disabled}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />

          {showClear && onClear && (
            <Pressable onPress={onClear} style={styles.clearButton} hitSlop={8}>
              <Text variant="bodySmall" color="tertiary">
                ✕
              </Text>
            </Pressable>
          )}

          {rightIcon && !showClear && (
            <View style={styles.rightIconContainer}>{rightIcon}</View>
          )}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text variant="caption" color="error">
              ⓘ {error}
            </Text>
          </View>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create(theme => ({
  wrapper: {
    width: '100%',
  },
  label: {
    marginBottom: theme.spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    overflow: 'hidden',
    variants: {
      variant: {
        primary: {
          borderColor: theme.colors.inputBorder,
          backgroundColor: theme.colors.inputBackground,
        },
        error: {
          borderColor: theme.colors.inputBorderError,
          backgroundColor: theme.colors.errorLight,
        },
      },
      size: {
        small: {
          minHeight: 36,
          paddingHorizontal: theme.spacing.sm,
        },
        medium: {
          minHeight: 48,
          paddingHorizontal: theme.spacing.md,
        },
        large: {
          minHeight: 56,
          paddingHorizontal: theme.spacing.lg,
        },
      },
      disabled: {
        true: {
          backgroundColor: theme.colors.buttonDisabled,
          borderColor: theme.colors.border,
          opacity: theme.opacity.disabled,
        },
      },
      focused: {
        true: {
          borderColor: theme.colors.inputBorder,
          borderWidth: 1,
        },
      },
      hasLeftIcon: {
        true: {
          paddingLeft: theme.spacing.xs,
        },
      },
      hasRightIcon: {
        true: {
          paddingRight: theme.spacing.xs,
        },
      },
    },
    compoundVariants: [
      {
        variant: 'error',
        focused: true,
        styles: {
          borderColor: theme.colors.inputBorderError,
        },
      },
    ],
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.md,
    lineHeight: theme.lineHeight.md,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.textPrimary,
    paddingVertical: theme.spacing.sm,
    variants: {
      size: {
        small: {
          fontSize: theme.fontSize.sm,
          lineHeight: theme.lineHeight.sm,
        },
        medium: {
          fontSize: theme.fontSize.md,
          lineHeight: theme.lineHeight.md,
        },
        large: {
          fontSize: theme.fontSize.lg,
          lineHeight: theme.lineHeight.lg,
        },
      },
      disabled: {
        true: {
          color: theme.colors.textDisabled,
          backgroundColor: theme.colors.buttonDisabled,
        },
      },
    },
  },
  leftIconContainer: {
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    marginLeft: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    marginLeft: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xs,
  },
  errorContainer: {
    marginTop: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
