import { Input } from '@/components/ui';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { View } from 'react-native';

describe('Input', () => {
  it('should match to snapshot', async () => {
    const { toJSON } = render(<Input />);

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render with a label', async () => {
    const { getByText } = render(<Input label="Username" />);

    await waitFor(() => {
      expect(getByText('Username')).toBeTruthy();
    });
  });

  it('should handle onChangeText event', async () => {
    const onChangeTextMock = jest.fn();
    const { getByTestId } = render(
      <Input onChangeText={onChangeTextMock} label="Email" />,
    );
    fireEvent.changeText(getByTestId('input'), 'test@example.com');
    await waitFor(() => {
      expect(onChangeTextMock).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('should be disabled', async () => {
    const { getByTestId } = render(<Input disabled label="Disabled Input" />);
    await waitFor(() => {
      expect(getByTestId('input')).toBeDisabled();
    });
  });

  it('should show an error message', async () => {
    const { getByText } = render(<Input error="Invalid input" />);
    await waitFor(() => {
      expect(getByText('Invalid input')).toBeTruthy();
    });
  });

  it('should render with left and right icons and handle presses', async () => {
    const onLeftIconPressMock = jest.fn();
    const onRightIconPressMock = jest.fn();
    const MockLeftIcon = () => <View testID="left-icon" />;
    const MockRightIcon = () => <View testID="right-icon" />;
    const { getByLabelText } = render(
      <Input
        leftIcon={MockLeftIcon}
        rightIcon={MockRightIcon}
        onLeftIconPress={onLeftIconPressMock}
        onRightIconPress={onRightIconPressMock}
      />,
    );

    fireEvent.press(getByLabelText('Left icon'));
    await waitFor(() => {
      expect(onLeftIconPressMock).toHaveBeenCalledTimes(1);
    });

    fireEvent.press(getByLabelText('Right icon'));
    await waitFor(() => {
      expect(onRightIconPressMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should show and handle clear button', () => {
    const onChangeTextMock = jest.fn();
    const { getByTestId } = render(
      <Input
        showClearButton
        value="Some text"
        onChangeText={onChangeTextMock}
        label="Clearable Input"
      />,
    );

    // Focus the input to show the clear button
    fireEvent(getByTestId('input'), 'focus');

    const clearButton = getByTestId('clear-button');
    expect(clearButton).toBeTruthy();
  });

  it('should handle onFocus and onBlur events', () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();
    const { getAllByLabelText } = render(
      <Input onFocus={onFocusMock} onBlur={onBlurMock} label="Focusable" />,
    );

    fireEvent(getAllByLabelText('Focusable')[0], 'focus');
    expect(onFocusMock).toHaveBeenCalledTimes(1);

    fireEvent(getAllByLabelText('Focusable')[0], 'blur');
    expect(onBlurMock).toHaveBeenCalledTimes(1);
  });

  it('should render with different sizes', () => {
    const { rerender, getByTestId } = render(<Input size="sm" />);
    const first = getByTestId('input');
    expect(first).toBeTruthy();

    rerender(<Input size="md" />);

    const second = getByTestId('input');
    expect(second).toBeTruthy();

    expect(first).toBe(second);
  });
});
