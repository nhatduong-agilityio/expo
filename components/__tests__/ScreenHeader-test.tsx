import { ScreenHeader } from '@/components';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { View } from 'react-native';

describe('ScreenHeader', () => {
  it('should match to snapshot with title only', async () => {
    const { toJSON } = render(<ScreenHeader title="My Screen" />);
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render the correct title', async () => {
    const { getByText } = render(<ScreenHeader title="Settings" />);
    await waitFor(() => {
      expect(getByText('Settings')).toBeTruthy();
    });
  });

  it('should render left icon and handle press', async () => {
    const onLeftPressMock = jest.fn();
    const MockLeftIcon = () => <View testID="left-icon" />;
    const { getByLabelText } = render(
      <ScreenHeader
        title="Back"
        leftIcon={MockLeftIcon}
        showLeftIcon
        onLeftPress={onLeftPressMock}
      />,
    );
    const leftButton = getByLabelText('Left icon');
    expect(leftButton).toBeTruthy();
    fireEvent.press(leftButton);

    await waitFor(() => {
      expect(onLeftPressMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should render right icon and handle press', async () => {
    const onRightPressMock = jest.fn();
    const MockRightIcon = () => <View testID="right-icon" />;
    const { getByLabelText } = render(
      <ScreenHeader
        title="Options"
        rightIcon={MockRightIcon}
        showRightIcon
        onRightPress={onRightPressMock}
      />,
    );
    const rightButton = getByLabelText('Right icon');
    expect(rightButton).toBeTruthy();
    fireEvent.press(rightButton);

    await waitFor(() => {
      expect(onRightPressMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should render custom left component', async () => {
    const CustomLeftComponent = () => <View testID="custom-left" />;
    const { getByTestId } = render(
      <ScreenHeader
        title="Custom Left"
        leftComponent={<CustomLeftComponent />}
      />,
    );

    await waitFor(() => {
      expect(getByTestId('custom-left')).toBeTruthy();
    });
  });

  it('should render custom right component', async () => {
    const CustomRightComponent = () => <View testID="custom-right" />;
    const { getByTestId } = render(
      <ScreenHeader
        title="Custom Right"
        rightComponent={<CustomRightComponent />}
      />,
    );
    await waitFor(() => {
      expect(getByTestId('custom-right')).toBeTruthy();
    });
  });

  it('should render placeholders when no icon or component is provided', async () => {
    const { toJSON } = render(<ScreenHeader title="Placeholder Test" />);

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
