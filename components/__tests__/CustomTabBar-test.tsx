import { CustomTabBar } from '@/components';
import { TABS } from '@/constants';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

// Mock factory for BottomTabBarProps
const createMockBottomTabBarProps = (overrides?: any): any => {
  const mockNavigate = jest.fn();
  const mockEmit = jest.fn().mockReturnValue({ defaultPrevented: false });
  const mockGoBack = jest.fn();
  const mockAddListener = jest.fn();
  const mockRemoveListener = jest.fn();
  const mockReset = jest.fn();
  const mockSetParams = jest.fn();
  const mockSetOptions = jest.fn();
  const mockDispatch = jest.fn();
  const mockIsFocused = jest.fn().mockReturnValue(true);
  const mockCanGoBack = jest.fn().mockReturnValue(false);
  const mockGetParent = jest.fn();
  const mockGetState = jest.fn();

  const mockNavigation = {
    navigate: mockNavigate,
    goBack: mockGoBack,
    addListener: mockAddListener,
    removeListener: mockRemoveListener,
    reset: mockReset,
    setParams: mockSetParams,
    setOptions: mockSetOptions,
    dispatch: mockDispatch,
    isFocused: mockIsFocused,
    canGoBack: mockCanGoBack,
    getParent: mockGetParent,
    getState: mockGetState,
    emit: mockEmit,
    getId: jest.fn(),
  };

  return {
    state: {
      index: 0,
      routes: [
        { key: 'home-key', name: 'index', params: undefined },
        { key: 'explore-key', name: 'explore', params: undefined },
        { key: 'bookmark-key', name: 'bookmark', params: undefined },
        { key: 'profile-key', name: 'profile', params: undefined },
      ],
      routeNames: ['index', 'explore', 'bookmark', 'profile'],
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
          tabBarIcon: jest.fn(),
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
        render: jest.fn(() => null),
      },
      'explore-key': {
        options: {
          title: 'Explore',
          tabBarAccessibilityLabel: 'Explore Tab',
          tabBarButtonTestID: 'explore-tab-button',
          tabBarLabel: 'Explore',
          tabBarIcon: jest.fn(),
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
        render: jest.fn(() => null),
      },
      'bookmark-key': {
        options: {
          title: 'Bookmark',
          tabBarAccessibilityLabel: 'Bookmark Tab',
          tabBarButtonTestID: 'bookmark-tab-button',
          tabBarLabel: 'Bookmark',
          tabBarIcon: jest.fn(),
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
        render: jest.fn(() => null),
      },
      'profile-key': {
        options: {
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile Tab',
          tabBarButtonTestID: 'profile-tab-button',
          tabBarLabel: 'Profile',
          tabBarIcon: jest.fn(),
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
        render: jest.fn(() => null),
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

describe('CustomTabBar', () => {
  const defaultProps = createMockBottomTabBarProps();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all tabs correctly', async () => {
      const { getByText } = render(<CustomTabBar {...defaultProps} />);

      await waitFor(() => {
        expect(getByText('Home')).toBeTruthy();
        expect(getByText('Explore')).toBeTruthy();
        expect(getByText('Bookmark')).toBeTruthy();
        expect(getByText('Profile')).toBeTruthy();
      });
    });

    it('should render correct number of tabs', () => {
      const { getAllByRole } = render(<CustomTabBar {...defaultProps} />);
      const buttons = getAllByRole('tab');

      expect(buttons).toHaveLength(4);
    });

    it('should apply correct accessibility labels', () => {
      const { getByLabelText } = render(<CustomTabBar {...defaultProps} />);

      expect(getByLabelText('Home Tab')).toBeTruthy();
      expect(getByLabelText('Explore Tab')).toBeTruthy();
      expect(getByLabelText('Bookmark Tab')).toBeTruthy();
      expect(getByLabelText('Profile Tab')).toBeTruthy();
    });

    it('should apply testIDs correctly', () => {
      const { getByTestId } = render(<CustomTabBar {...defaultProps} />);

      expect(getByTestId('home-tab-button')).toBeTruthy();
      expect(getByTestId('explore-tab-button')).toBeTruthy();
      expect(getByTestId('bookmark-tab-button')).toBeTruthy();
      expect(getByTestId('profile-tab-button')).toBeTruthy();
    });

    it('should use route name when title is not provided', () => {
      const props = createMockBottomTabBarProps({
        state: {
          routes: [
            { key: 'home-key', name: 'index', params: undefined },
            { key: 'explore-key', name: 'explore', params: undefined },
            { key: 'bookmark-key', name: 'bookmark', params: undefined },
            { key: 'profile-key', name: 'profile', params: undefined },
          ],
        },
        descriptors: {
          'home-key': {
            options: {
              title: undefined,
              tabBarAccessibilityLabel: 'Home Tab',
              tabBarButtonTestID: 'home-tab-button',
            },
            navigation: createMockBottomTabBarProps().navigation,
            render: jest.fn(() => null),
          },
        },
      });

      const { getByText } = render(<CustomTabBar {...props} />);
      expect(getByText('index')).toBeTruthy();
    });
  });

  describe('Active State', () => {
    it('should mark the first tab as selected by default', () => {
      const { getByTestId } = render(<CustomTabBar {...defaultProps} />);
      const homeButton = getByTestId('home-tab-button');

      expect(homeButton.props.accessibilityState).toEqual({ selected: true });
    });

    it('should mark the correct tab as selected based on state index', () => {
      const props = createMockBottomTabBarProps({
        state: { index: 1 },
      });

      const { getByTestId } = render(<CustomTabBar {...props} />);

      const exploreButton = getByTestId('explore-tab-button');
      expect(exploreButton.props.accessibilityState).toEqual({
        selected: true,
      });

      const homeButton = getByTestId('home-tab-button');
      expect(homeButton.props.accessibilityState).toEqual({ selected: false });
    });
  });

  describe('Navigation', () => {
    it('should navigate to tab when pressed', () => {
      const props = createMockBottomTabBarProps();
      const { getByTestId } = render(<CustomTabBar {...props} />);
      const exploreButton = getByTestId('explore-tab-button');

      fireEvent.press(exploreButton);

      expect(props.navigation.emit).toHaveBeenCalledWith({
        type: 'tabPress',
        target: 'explore-key',
        canPreventDefault: true,
      });
      expect(props.navigation.navigate).toHaveBeenCalledWith('explore');
    });

    it('should not navigate when pressing the already active tab', () => {
      const props = createMockBottomTabBarProps();
      const { getByTestId } = render(<CustomTabBar {...props} />);
      const homeButton = getByTestId('home-tab-button');

      fireEvent.press(homeButton);

      expect(props.navigation.emit).toHaveBeenCalled();
      expect(props.navigation.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when event is prevented', () => {
      const props = createMockBottomTabBarProps();
      props.navigation.emit = jest
        .fn()
        .mockReturnValue({ defaultPrevented: true });

      const { getByTestId } = render(<CustomTabBar {...props} />);
      const exploreButton = getByTestId('explore-tab-button');

      fireEvent.press(exploreButton);

      expect(props.navigation.emit).toHaveBeenCalled();
      expect(props.navigation.navigate).not.toHaveBeenCalled();
    });

    it('should emit tabLongPress event on long press', () => {
      const props = createMockBottomTabBarProps();
      const { getByTestId } = render(<CustomTabBar {...props} />);
      const homeButton = getByTestId('home-tab-button');

      fireEvent(homeButton, 'onLongPress');

      expect(props.navigation.emit).toHaveBeenCalledWith({
        type: 'tabLongPress',
        target: 'home-key',
      });
    });
  });

  describe('Icon Display', () => {
    it('should display outlined icons for inactive tabs', () => {
      const { getByTestId } = render(<CustomTabBar {...defaultProps} />);
      const icon = getByTestId(
        `icon-${TABS.EXPLORE.ICON_OUTLINE.name}-false-false`,
      );
      expect(icon).toBeTruthy();
    });

    it('should display filled icon for active tab', () => {
      const { getByTestId } = render(<CustomTabBar {...defaultProps} />);
      const icon = getByTestId(`icon-${TABS.HOME.ICON.name}-true-false`);
      expect(icon).toBeTruthy();
    });

    it('should update icon when tab becomes active', () => {
      const { rerender, getByTestId } = render(
        <CustomTabBar {...defaultProps} />,
      );
      const inactiveIcon = getByTestId(
        `icon-${TABS.EXPLORE.ICON_OUTLINE.name}-false-false`,
      );
      expect(inactiveIcon).toBeTruthy();

      const propsWithSecondTabActive = createMockBottomTabBarProps({
        state: { index: 1 },
      });

      rerender(<CustomTabBar {...propsWithSecondTabActive} />);
      const activeIcon = getByTestId(
        `icon-${TABS.EXPLORE.ICON.name}-true-false`,
      );
      expect(activeIcon).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility hints', () => {
      const { getByTestId } = render(<CustomTabBar {...defaultProps} />);

      const homeButton = getByTestId('home-tab-button');
      expect(homeButton.props.accessibilityHint).toBe(
        'Navigates to the Home screen',
      );

      const exploreButton = getByTestId('explore-tab-button');
      expect(exploreButton.props.accessibilityHint).toBe(
        'Navigates to the Explore screen',
      );
    });

    it('should have button accessibility role', () => {
      const { getAllByRole } = render(<CustomTabBar {...defaultProps} />);
      const buttons = getAllByRole('tab');

      expect(buttons).toHaveLength(4);
      buttons.forEach(button => {
        expect(button.props.accessibilityRole).toBe('tab');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle tab bar with fewer tabs', () => {
      const props = createMockBottomTabBarProps({
        state: {
          routes: [
            { key: 'home-key', name: 'index', params: undefined },
            { key: 'explore-key', name: 'explore', params: undefined },
          ],
          routeNames: ['index', 'explore'],
        },
      });

      const { getAllByRole } = render(<CustomTabBar {...props} />);
      const buttons = getAllByRole('tab');

      expect(buttons).toHaveLength(2);
    });
  });
});
