import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ComponentProps } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { TABS } from '@/constants';

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

  return (
    <View
      style={styles.tabBar}
      accessibilityLabel="Main navigation tabs"
      accessibilityHint="Tap to select a tab"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
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
        let iconName: ComponentProps<typeof Ionicons>['name'] = 'home-outline';
        let iconNameFocused: ComponentProps<typeof Ionicons>['name'] = 'home';

        switch (route.name) {
          case TABS.HOME.NAME:
            iconName = TABS.HOME.ICON_OUTLINE;
            iconNameFocused = TABS.HOME.ICON;
            break;
          case TABS.EXPLORE.NAME:
            iconName = TABS.EXPLORE.ICON_OUTLINE;
            iconNameFocused = TABS.EXPLORE.ICON;
            break;
          case TABS.BOOKMARK.NAME:
            iconName = TABS.BOOKMARK.ICON_OUTLINE;
            iconNameFocused = TABS.BOOKMARK.ICON;
            break;
          case TABS.PROFILE.NAME:
            iconName = TABS.PROFILE.ICON_OUTLINE;
            iconNameFocused = TABS.PROFILE.ICON;
            break;
        }

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
            <Ionicons
              name={isFocused ? iconNameFocused : iconName}
              size={24}
              color={
                isDisabled
                  ? theme.colors.iconDisabled
                  : isFocused
                    ? theme.colors.primary
                    : theme.colors.iconSecondary
              }
            />
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
