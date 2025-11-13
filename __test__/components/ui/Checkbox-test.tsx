import { Checkbox } from '@/components/ui';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

describe('Checkbox', () => {
  it('should match to snapshot', async () => {
    const { toJSON } = render(<Checkbox />);

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render with a label', async () => {
    const { getByText } = render(<Checkbox label="Accept terms" />);

    await waitFor(() => {
      expect(getByText('Accept terms')).toBeTruthy();
    });
  });

  it('should handle onChange event when toggled', async () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <Checkbox onChange={onChangeMock} label="Toggle me" />,
    );
    fireEvent.press(getByTestId('checkbox-pressable'));
    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith(true);
    });
  });

  it('should not handle onChange event when disabled', async () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <Checkbox onChange={onChangeMock} disabled label="Disabled" />,
    );
    fireEvent.press(getByTestId('checkbox-pressable'));
    await waitFor(() => {
      expect(onChangeMock).not.toHaveBeenCalled();
    });
  });

  it('should be in a checked state', async () => {
    const { toJSON } = render(<Checkbox checked />);

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render with different sizes', async () => {
    const { rerender, getByTestId } = render(<Checkbox size="sm" />);

    const smallCheckbox = getByTestId('checkbox-pressable');
    expect(smallCheckbox).toBeTruthy();

    rerender(<Checkbox size="lg" />);

    const largeCheckbox = getByTestId('checkbox-pressable');
    expect(largeCheckbox).toBeTruthy();

    expect(smallCheckbox).toBe(largeCheckbox);
  });
});
