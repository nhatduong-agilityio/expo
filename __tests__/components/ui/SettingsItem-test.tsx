import { SettingsItem } from '@/components/ui';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

describe('SettingsItem', () => {
  it('should match to snapshot', async () => {
    const { toJSON } = render(
      <SettingsItem icon="settings" label="Settings" />,
    );

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render with the correct label and icon', () => {
    const { getByText } = render(
      <SettingsItem icon="person" label="Profile" />,
    );
    expect(getByText('Profile')).toBeTruthy();
    // Icon presence is checked via snapshot
  });

  it('should handle onPress event', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <SettingsItem icon="log-out" label="Logout" onPress={onPressMock} />,
    );
    fireEvent.press(getByText('Logout'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should show a chevron by default', () => {
    const { toJSON } = render(
      <SettingsItem icon="notifications" label="Notifications" />,
    );
    // Presence of chevron icon is best verified with a snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('should hide the chevron when showChevron is false', () => {
    const { toJSON } = render(
      <SettingsItem icon="help" label="Help" showChevron={false} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show a Switch when showSwitch is true', () => {
    const { getByTestId } = render(
      <SettingsItem icon="moon" label="Dark Mode" showSwitch />,
    );
    expect(getByTestId('switch')).toBeTruthy();
  });

  it('should handle onSwitchChange event', () => {
    const onSwitchChangeMock = jest.fn();
    const { getByTestId } = render(
      <SettingsItem
        icon="notifications"
        label="Push Notifications"
        showSwitch
        onSwitchChange={onSwitchChangeMock}
      />,
    );
    fireEvent(getByTestId('switch'), 'change', true);
    expect(onSwitchChangeMock).toHaveBeenCalledWith(true);
  });

  it('should be disabled for press when the switch is shown', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <SettingsItem
        icon="wifi"
        label="Wi-Fi"
        showSwitch
        onPress={onPressMock}
      />,
    );
    fireEvent.press(getByText('Wi-Fi'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
