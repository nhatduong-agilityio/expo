import { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, PressableProps, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from './Text';

export type SwitchProps = Omit<PressableProps, 'children'> & {
  value?: boolean;
  onChange?: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export const Switch = memo(
  ({
    value = false,
    onChange,
    label,
    disabled = false,
    size = 'md',
    ...rest
  }: SwitchProps) => {
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [value, animatedValue]);

    styles.useVariants({
      value: value || undefined,
      disabled: disabled || undefined,
      size,
    });

    const handlePress = () => {
      if (!disabled && onChange) {
        onChange(!value);
      }
    };

    const getThumbTranslateX = () => {
      switch (size) {
        case 'sm':
          return [2, 18];
        case 'lg':
          return [2, 26];
        default: // md
          return [2, 18];
      }
    };

    const [outputStart, outputEnd] = getThumbTranslateX();
    const thumbTranslateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [outputStart, outputEnd],
    });

    return (
      <Pressable
        testID="switch"
        style={({ pressed }) => [
          styles.container,
          pressed && !disabled && styles.pressed,
        ]}
        onPress={handlePress}
        disabled={disabled}
        {...rest}
      >
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.thumb,
              {
                transform: [{ translateX: thumbTranslateX }],
              },
            ]}
          />
        </View>
        {label && (
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        )}
      </Pressable>
    );
  },
);

Switch.displayName = 'Switch';

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  track: {
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    backgroundColor: theme.colors.checkboxChecked,
    opacity: theme.opacity.disabled,
    variants: {
      size: {
        sm: {
          width: 28,
          height: 14,
        },
        md: {
          width: 32,
          height: 16,
        },
        lg: {
          width: 40,
          height: 20,
        },
      },
      value: {
        true: {
          backgroundColor: theme.colors.checkboxChecked,
          opacity: 1,
        },
        false: {
          backgroundColor: theme.colors.checkboxChecked,
          opacity: theme.opacity.disabled,
        },
      },
      disabled: {
        true: {
          backgroundColor: theme.colors.buttonDisabled,
          opacity: theme.opacity.disabled,
        },
      },
    },
  },
  thumb: {
    backgroundColor: theme.colors.textOnPrimary,
    borderRadius: theme.borderRadius.full,
    variants: {
      size: {
        sm: {
          width: 10,
          height: 10,
        },
        md: {
          width: 12,
          height: 12,
        },
        lg: {
          width: 16,
          height: 16,
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
