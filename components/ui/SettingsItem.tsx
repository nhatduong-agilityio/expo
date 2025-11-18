import { ComponentType, memo } from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { StyleSheet } from 'react-native-unistyles';

// Components
import { RightOutline } from '../icons';
import { Switch } from './Switch';
import { Text } from './Text';

export type SettingsItemProps = Omit<PressableProps, 'children'> & {
  icon: ComponentType<SvgProps>;
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
    const getAccessibilityLabel = () => {
      if (accessibilityLabel) return accessibilityLabel;
      let baseLabel = label;
      if (showSwitch) baseLabel += `. Switch is ${switchValue ? 'on' : 'off'}`;
      return baseLabel;
    };

    const getAccessibilityHint = () => {
      if (accessibilityHint) return accessibilityHint;
      if (showSwitch) return switchValue ? 'Tap to turn off' : 'Tap to turn on';
      return 'Tap to open';
    };

    const Icon = icon;

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
          <Icon />
          <Text variant="body" style={styles.label}>
            {label}
          </Text>
        </View>

        {showSwitch ? (
          <Switch value={switchValue} onChange={onSwitchChange} />
        ) : showChevron ? (
          <RightOutline />
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
