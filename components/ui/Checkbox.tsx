import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
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

    return (
      <Pressable
        testID="checkbox-pressable"
        style={({ pressed }) => [
          styles.container,
          pressed && !disabled && styles.pressed,
        ]}
        onPress={handlePress}
        disabled={disabled}
        {...rest}
      >
        <View testID="checkbox-container" style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            {checked && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark" size={18} color="white" />
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
