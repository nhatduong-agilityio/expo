import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Constants
import { TABS } from '@/constants';

// Components
import { Text } from '@/components/ui';

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
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
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            accessibilityHint={`Navigates to the ${label} screen`}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            <Ionicons
              name={isFocused ? iconNameFocused : iconName}
              size={24}
              color={
                isFocused ? theme.colors.primary : theme.colors.iconSecondary
              }
            />
            <Text
              variant="bodySm"
              style={[
                styles.label,
                isFocused && { color: theme.colors.primary },
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
    ...theme.shadow.sm,
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
