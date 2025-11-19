import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentType, forwardRef, memo, useState } from 'react';
import {
  Pressable,
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import {
  StyleSheet,
  UnistylesVariants,
  useUnistyles,
} from 'react-native-unistyles';
import { CloseOutline } from '../icons';
import { Text } from './Text';

type InputVariants = UnistylesVariants<typeof styles>;

export type InputProps = Omit<TextInputProps, 'placeholderTextColor'> & {
  variant?: 'primary' | 'error';
  size?: InputVariants['size'];
  label?: string;
  error?: string;
  disabled?: boolean;
  leftIcon?: ComponentType<SvgProps>;
  rightIcon?: ComponentType<SvgProps>;
  showClearButton?: boolean;
  styleContainer?: StyleProp<ViewStyle>;
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;
  required?: boolean;
};

export const Input = memo(
  forwardRef<TextInput, InputProps>(
    (
      {
        variant = 'primary',
        size = 'md',
        label,
        error,
        disabled = false,
        leftIcon,
        rightIcon,
        showClearButton = false,
        value,
        styleContainer,
        onFocus,
        onBlur,
        onRightIconPress,
        onLeftIconPress,
        style,
        required = false,
        accessibilityLabel,
        accessibilityHint,
        ...rest
      },
      ref,
    ) => {
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

      const handleOnClear = () => {
        rest.onChangeText?.('');
      };

      const showClear = showClearButton && hasValue && !disabled && isFocused;

      const inputAccessibilityLabel =
        accessibilityLabel || required
          ? label + '*'
          : label || rest.placeholder;
      const inputAccessibilityHint =
        accessibilityHint || (error ? `Error: ${error}` : undefined);

      const LeftIcon = leftIcon;
      const RightIcon = rightIcon;

      return (
        <View style={styles.wrapper}>
          {label && (
            <View style={styles.labelContainer}>
              <Text
                variant="label"
                color={disabled ? 'disabled' : 'primary'}
                style={styles.label}
              >
                {label}
              </Text>
              {required && (
                <Text variant="label" color="error" style={styles.label}>
                  *
                </Text>
              )}
            </View>
          )}

          <View style={[styles.container, styleContainer]}>
            {LeftIcon && (
              <Pressable
                testID="left-icon"
                style={styles.leftIconContainer}
                onPress={onLeftIconPress}
                hitSlop={8}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel="Left icon"
                accessibilityHint={
                  onLeftIconPress ? 'Tap to the left icon' : undefined
                }
              >
                <LeftIcon color={styles.icon(!!error).color} />
              </Pressable>
            )}

            <TextInput
              testID="input"
              ref={ref}
              style={[styles.input, style]}
              placeholderTextColor={theme.colors.textPlaceholder}
              editable={!disabled}
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              accessibilityLabel={inputAccessibilityLabel}
              accessibilityHint={inputAccessibilityHint}
              accessibilityState={{ disabled }}
              {...rest}
            />

            {showClear && (
              <Pressable
                testID="clear-button"
                onPress={handleOnClear}
                style={styles.clearButton}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Clear input"
                accessibilityHint="Tap to clear the text from the input field"
              >
                <CloseOutline color={styles.icon(!!error).color} />
              </Pressable>
            )}

            {RightIcon && !showClear && (
              <Pressable
                testID="right-icon"
                style={styles.rightIconContainer}
                onPress={onRightIconPress}
                hitSlop={8}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel="Right icon"
                accessibilityHint={
                  onRightIconPress ? 'Tap to the right icon' : undefined
                }
              >
                <RightIcon color={styles.icon(!!error).color} />
              </Pressable>
            )}
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color={styles.icon(!!error).color}
              />
              <Text
                variant="caption"
                color="error"
                accessibilityLabel="Error"
                accessibilityHint="Error"
              >
                {error}
              </Text>
            </View>
          )}
        </View>
      );
    },
  ),
);

Input.displayName = 'Input';

const styles = StyleSheet.create(theme => ({
  wrapper: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
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
        sm: {
          minHeight: 36,
          paddingHorizontal: theme.spacing.sm,
        },
        md: {
          minHeight: 48,
          paddingHorizontal: theme.spacing.md,
        },
        lg: {
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
        sm: {
          fontSize: theme.fontSize.sm,
          lineHeight: theme.lineHeight.sm,
        },
        md: {
          fontSize: theme.fontSize.md,
          lineHeight: theme.lineHeight.md,
        },
        lg: {
          fontSize: theme.fontSize.lg,
          lineHeight: theme.lineHeight.lg,
        },
      },
      disabled: {
        true: {
          color: theme.colors.textDisabled,
        },
      },
    },
  },
  leftIconContainer: {
    marginHorizontal: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    marginHorizontal: theme.spacing.sm,
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
    gap: theme.spacing.xs,
  },
  icon: (isError: boolean) => ({
    color: isError ? theme.colors.inputBorderError : theme.colors.iconSecondary,
  }),
}));
