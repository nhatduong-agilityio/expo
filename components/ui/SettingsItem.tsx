import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps, memo } from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Components
import { Switch } from './Switch';
import { Text } from './Text';

export type SettingsItemProps = Omit<PressableProps, 'children'> & {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
};

export const SettingsItem = memo(
  ({
    icon,
    label,
    showChevron = true,
    showSwitch = false,
    switchValue = false,
    onSwitchChange,
    accessibilityLabel,
    accessibilityHint,
    ...rest
  }: SettingsItemProps) => {
    const { theme } = useUnistyles();

    const getAccessibilityLabel = () => {
      if (accessibilityLabel) return accessibilityLabel;
      let baseLabel = label;
      if (showSwitch) baseLabel += `. Switch is ${switchValue ? 'on' : 'off'}`;
      return baseLabel;
    };

    const getAccessibilityHint = () => {
      if (accessibilityHint) return accessibilityHint;
      if (showSwitch)
        return switchValue ? 'Double tap to turn off' : 'Double tap to turn on';
      return 'Double tap to open';
    };

    return (
      <Pressable
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        disabled={showSwitch}
        accessibilityRole={showSwitch ? 'switch' : 'button'}
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint={getAccessibilityHint()}
        accessibilityState={showSwitch ? { checked: switchValue } : undefined}
        {...rest}
      >
        <View style={styles.leftContent}>
          <Ionicons name={icon} size={24} color={theme.colors.iconPrimary} />
          <Text variant="body" style={styles.label}>
            {label}
          </Text>
        </View>

        {showSwitch ? (
          <Switch value={switchValue} onChange={onSwitchChange} />
        ) : showChevron ? (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.iconSecondary}
          />
        ) : null}
      </Pressable>
    );
  },
);

SettingsItem.displayName = 'SettingsItem';

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  label: {
    color: theme.colors.textPrimary,
  },
}));
