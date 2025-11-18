import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ComponentType } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Utils
import { getTabBarConfig } from '@/utils';

// Components
import { Text } from '@/components/ui';

type CustomTabBarProps = BottomTabBarProps & {
  disabledRoutes?: string[];
};

export const CustomTabBar = ({
  disabledRoutes,
  state,
  descriptors,
  navigation,
}: CustomTabBarProps) => {
  const { theme } = useUnistyles();

  const renderTabBarIcon = (
    Icon: ComponentType<SvgProps>,
    focused = false,
    disabled = false,
    size = 24,
  ) => {
    const color = disabled
      ? theme.colors.iconDisabled
      : focused
        ? theme.colors.primary
        : theme.colors.iconSecondary;

    return (
      <Icon
        width={size}
        height={size}
        color={color}
        testID={`icon-${Icon.name}-${focused}-${disabled}`}
      />
    );
  };

  return (
    <View
      style={styles.tabBar}
      accessibilityLabel="Main navigation tabs"
      accessibilityHint="Tap to select a tab"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const tabConfig = getTabBarConfig(route.name);

        if (!tabConfig) return null; // Skip if no config found

        const label = options.title || route.name;
        const isFocused = state.index === index;
        const isDisabled = disabledRoutes?.includes(route.name);

        const onPress = () => {
          // Check if route is disabled
          if (isDisabled) {
            return; // Don't navigate
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          // Check if route is disabled
          if (isDisabled) {
            return;
          }

          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Get icon name based on route
        const IconComponent = isFocused
          ? tabConfig.ICON
          : tabConfig.ICON_OUTLINE;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused, disabled: isDisabled }}
            accessibilityLabel={options.tabBarAccessibilityLabel || label}
            accessibilityHint={`Navigates to the ${label} screen`}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            disabled={isDisabled}
          >
            {renderTabBarIcon(IconComponent, isFocused, isDisabled)}
            <Text
              variant="bodySm"
              style={[
                styles.label,
                isFocused && { color: theme.colors.primary },
                isDisabled && { color: theme.colors.textDisabled },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xl,
    ...(Platform.OS === 'ios' && theme.shadow.sm),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
}));
