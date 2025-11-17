import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { CustomTabBar } from '@/components';
import { fn } from 'storybook/test';

const createMockBottomTabBarProps = (overrides?: any): any => {
  const mockNavigation = fn().mockReturnValue({});

  return {
    state: {
      index: 0,
      routes: [
        { key: 'home-key', name: 'Home', params: undefined },
        { key: 'explore-key', name: 'Explore', params: undefined },
        { key: 'bookmark-key', name: 'Bookmark', params: undefined },
        { key: 'profile-key', name: 'Profile', params: undefined },
      ],
      routeNames: ['Home', 'Explore', 'Bookmark', 'Profile'],
      history: [],
      type: 'tab' as const,
      stale: false,
      key: 'tab-state-key',
      ...overrides?.state,
    },
    descriptors: {
      'home-key': {
        options: {
          title: 'Home',
          tabBarAccessibilityLabel: 'Home Tab',
          tabBarButtonTestID: 'home-tab-button',
          tabBarLabel: 'Home',
          tabBarIcon: fn(),
          tabBarBadge: undefined,
          tabBarBadgeStyle: {},
          tabBarActiveTintColor: undefined,
          tabBarInactiveTintColor: undefined,
          tabBarActiveBackgroundColor: undefined,
          tabBarInactiveBackgroundColor: undefined,
          tabBarShowLabel: true,
          tabBarLabelStyle: {},
          tabBarIconStyle: {},
          tabBarItemStyle: {},
          tabBarStyle: {},
          tabBarBackground: undefined,
          tabBarButton: undefined,
          lazy: true,
          unmountOnBlur: false,
          freezeOnBlur: false,
          headerShown: false,
        },
        navigation: mockNavigation,
        render: fn(() => null),
      },
      'explore-key': {
        options: {
          title: 'Explore',
          tabBarAccessibilityLabel: 'Explore Tab',
          tabBarButtonTestID: 'explore-tab-button',
          tabBarLabel: 'Explore',
          tabBarIcon: fn(),
          tabBarBadge: undefined,
          tabBarBadgeStyle: {},
          tabBarActiveTintColor: undefined,
          tabBarInactiveTintColor: undefined,
          tabBarActiveBackgroundColor: undefined,
          tabBarInactiveBackgroundColor: undefined,
          tabBarShowLabel: true,
          tabBarLabelStyle: {},
          tabBarIconStyle: {},
          tabBarItemStyle: {},
          tabBarStyle: {},
          tabBarBackground: undefined,
          tabBarButton: undefined,
          lazy: true,
          unmountOnBlur: false,
          freezeOnBlur: false,
          headerShown: false,
        },
        navigation: mockNavigation,
        render: fn(() => null),
      },
      'bookmark-key': {
        options: {
          title: 'Bookmark',
          tabBarAccessibilityLabel: 'Bookmark Tab',
          tabBarButtonTestID: 'bookmark-tab-button',
          tabBarLabel: 'Bookmark',
          tabBarIcon: fn(),
          tabBarBadge: undefined,
          tabBarBadgeStyle: {},
          tabBarActiveTintColor: undefined,
          tabBarInactiveTintColor: undefined,
          tabBarActiveBackgroundColor: undefined,
          tabBarInactiveBackgroundColor: undefined,
          tabBarShowLabel: true,
          tabBarLabelStyle: {},
          tabBarIconStyle: {},
          tabBarItemStyle: {},
          tabBarStyle: {},
          tabBarBackground: undefined,
          tabBarButton: undefined,
          lazy: true,
          unmountOnBlur: false,
          freezeOnBlur: false,
          headerShown: false,
        },
        navigation: mockNavigation,
        render: fn(() => null),
      },
      'profile-key': {
        options: {
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile Tab',
          tabBarButtonTestID: 'profile-tab-button',
          tabBarLabel: 'Profile',
          tabBarIcon: fn(),
          tabBarBadge: undefined,
          tabBarBadgeStyle: {},
          tabBarActiveTintColor: undefined,
          tabBarInactiveTintColor: undefined,
          tabBarActiveBackgroundColor: undefined,
          tabBarInactiveBackgroundColor: undefined,
          tabBarShowLabel: true,
          tabBarLabelStyle: {},
          tabBarIconStyle: {},
          tabBarItemStyle: {},
          tabBarStyle: {},
          tabBarBackground: undefined,
          tabBarButton: undefined,
          lazy: true,
          unmountOnBlur: false,
          freezeOnBlur: false,
          headerShown: false,
        },
        navigation: mockNavigation,
        render: fn(() => null),
      },
      ...overrides?.descriptors,
    },
    navigation: mockNavigation,
    insets: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...overrides?.insets,
    },
  };
};
const defaultProps = createMockBottomTabBarProps();

const meta = {
  title: 'Components/CustomTabBar',
  component: CustomTabBar,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: { disabledRoutes: ['Bookmark', 'Profile', 'Explore', 'Home'] },
} satisfies Meta<typeof CustomTabBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...defaultProps,
  },
};
