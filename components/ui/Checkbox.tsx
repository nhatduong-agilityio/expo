import { memo } from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { CheckOutline } from '../icons';
import { Text } from './Text';

export type CheckboxProps = Omit<PressableProps, 'children'> & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export const Checkbox = memo(
  ({
    checked = false,
    onChange,
    label,
    disabled = false,
    size = 'md',
    accessibilityLabel,
    accessibilityHint,
    ...rest
  }: CheckboxProps) => {
    styles.useVariants({
      checked: checked || undefined,
      disabled: disabled || undefined,
      size,
    });

    const handlePress = () => {
      if (!disabled && onChange) {
        onChange(!checked);
      }
    };

    const getAccessibilityLabel = () => {
      if (accessibilityLabel) return accessibilityLabel;
      if (label) return `${label} checkbox`;
      return 'Checkbox';
    };

    const getAccessibilityHint = () => {
      if (accessibilityHint) return accessibilityHint;
      return checked ? 'Tap to uncheck' : 'Tap to check';
    };

    return (
      <Pressable
        testID="checkbox-pressable"
        style={({ pressed }) => [
          styles.container,
          pressed && !disabled && styles.pressed,
        ]}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint={getAccessibilityHint()}
        accessibilityState={{ checked, disabled }}
        {...rest}
      >
        <View testID="checkbox-container" style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            {checked && (
              <View style={styles.checkmark} accessible={false}>
                <CheckOutline
                  width={18}
                  height={18}
                  color={styles.checkmarkIcon.color}
                />
              </View>
            )}
          </View>
        </View>
        {label && (
          <Text variant="label" style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        )}
      </Pressable>
    );
  },
);

Checkbox.displayName = 'Checkbox';

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  checkboxContainer: {
    variants: {
      size: {
        sm: {
          width: 20,
          height: 20,
        },
        md: {
          width: 24,
          height: 24,
        },
        lg: {
          width: 28,
          height: 28,
        },
      },
    },
  },
  checkbox: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: theme.colors.checkboxBorder,
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      checked: {
        true: {
          backgroundColor: theme.colors.checkboxChecked,
          borderColor: theme.colors.checkboxChecked,
        },
        false: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.checkboxBorder,
          opacity: theme.opacity.disabled,
        },
      },
      disabled: {
        true: {
          backgroundColor: theme.colors.buttonDisabled,
          borderColor: theme.colors.checkboxBorder,
          opacity: theme.opacity.disabled,
        },
      },
    },
  },
  checkmark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    variants: {
      checked: {
        true: {
          color: theme.colors.textOnPrimary,
        },
      },
    },
  },
  label: {
    flex: 1,
    variants: {
      disabled: {
        true: {
          color: theme.colors.textDisabled,
        },
        false: {
          color: theme.colors.textPrimary,
        },
      },
    },
  },
}));
