import { FloatButton } from '@/components/ui';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

describe('FloatButton', () => {
  it('should match to snapshot', async () => {
    const { toJSON } = render(<FloatButton />);

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should handle onPress event', async () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(<FloatButton onPress={onPressMock} />);

    fireEvent.press(getByRole('button'));
    await waitFor(() => {
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should be disabled', async () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <FloatButton onPress={onPressMock} disabled />,
    );
    fireEvent.press(getByRole('button'));

    await waitFor(() => {
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  it('should be in loading state', async () => {
    const onPressMock = jest.fn();
    const { getByRole, queryByTestId } = render(
      <FloatButton onPress={onPressMock} loading />,
    );
    fireEvent.press(getByRole('button'));

    await waitFor(() => {
      expect(onPressMock).not.toHaveBeenCalled();
      // Check that the icon is not rendered
      expect(queryByTestId('icon-container')).toBeNull();
    });
  });

  it('should render with different variants', () => {
    const { rerender, getByTestId } = render(<FloatButton variant="primary" />);

    const buttonR = getByTestId('float-button-pressable');
    expect(buttonR).toBeTruthy();

    rerender(<FloatButton variant="secondary" />);

    const buttonL = getByTestId('float-button-pressable');

    expect(buttonL).toBeTruthy();
    expect(buttonR).toBe(buttonL);
  });

  it('should render with different sizes', () => {
    const { rerender, getByTestId } = render(<FloatButton size="md" />);

    const buttonR = getByTestId('float-button-pressable');
    expect(buttonR).toBeTruthy();

    rerender(<FloatButton size="lg" />);

    const buttonL = getByTestId('float-button-pressable');

    expect(buttonL).toBeTruthy();
    expect(buttonR).toBe(buttonL);
  });

  it('should render in different positions', () => {
    const { rerender, getByTestId } = render(
      <FloatButton position="bottom-right" />,
    );

    const buttonR = getByTestId('float-button-pressable');
    expect(buttonR).toBeTruthy();

    rerender(<FloatButton position="top-left" />);

    const buttonL = getByTestId('float-button-pressable');
    expect(buttonL).toBeTruthy();

    expect(buttonR).toBe(buttonL);
  });

  it('should render with a specific icon', async () => {
    const { toJSON } = render(<FloatButton iconName="pencil" />);
    // We rely on snapshot testing to verify the icon, as direct icon name
    // testing is not straightforward without additional test setup.
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
