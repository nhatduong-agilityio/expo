import { Tabs } from '@/components/ui';
import { fireEvent, render } from '@testing-library/react-native';

const mockTabs = [
  { id: '1', label: 'Home' },
  { id: '2', label: 'Profile' },
  { id: '3', label: 'Settings' },
];

describe('Tabs', () => {
  it('should match to snapshot', () => {
    const { toJSON } = render(
      <Tabs tabs={mockTabs} activeTab="1" onTabChange={jest.fn()} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render the correct number of tabs with correct labels', () => {
    const { getByText } = render(
      <Tabs tabs={mockTabs} activeTab="1" onTabChange={jest.fn()} />,
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  it('should handle onTabChange event when a tab is pressed', () => {
    const onTabChangeMock = jest.fn();
    const { getByText } = render(
      <Tabs tabs={mockTabs} activeTab="1" onTabChange={onTabChangeMock} />,
    );
    fireEvent.press(getByText('Profile'));
    expect(onTabChangeMock).toHaveBeenCalledWith('2');
  });

  it('should have the correct accessibility state for the active tab', () => {
    const { getByLabelText } = render(
      <Tabs tabs={mockTabs} activeTab="2" onTabChange={jest.fn()} />,
    );
    const activeTab = getByLabelText('Profile');
    expect(activeTab.props.accessibilityState.selected).toBe(true);

    const inactiveTab = getByLabelText('Home');
    expect(inactiveTab.props.accessibilityState.selected).toBe(false);
  });

  it('should render with different variants', () => {
    const { rerender, getByTestId } = render(
      <Tabs tabs={mockTabs} activeTab="1" onTabChange={jest.fn()} />,
    );
    const first = getByTestId('tabs');
    expect(first).toBeTruthy();

    rerender(
      <Tabs
        tabs={mockTabs}
        activeTab="1"
        onTabChange={jest.fn()}
        variant="secondary"
      />,
    );

    const second = getByTestId('tabs');
    expect(second).toBeTruthy();

    expect(first).toBe(second);
  });
});
