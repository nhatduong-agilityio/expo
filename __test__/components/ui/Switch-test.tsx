import { Switch } from '@/components/ui';
import { fireEvent, render } from '@testing-library/react-native';

describe('Switch', () => {
  it('should match to snapshot', () => {
    const { toJSON } = render(<Switch />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with a label', () => {
    const { getByText } = render(<Switch label="Enable Feature" />);
    expect(getByText('Enable Feature')).toBeTruthy();
  });

  it('should handle onChange event when toggled', () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <Switch value={false} onChange={onChangeMock} />,
    );
    fireEvent(getByTestId('switch'), 'change', true);
    expect(onChangeMock).toHaveBeenCalledWith(true);
  });

  it('should not handle onChange event when disabled', () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(<Switch onChange={onChangeMock} disabled />);
    fireEvent.press(getByTestId('switch'));
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('should reflect the value prop (on state)', () => {
    const { toJSON } = render(<Switch value={true} />);
    // The change in appearance is handled by styles, which we can
    // verify with a snapshot.
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with different sizes', () => {
    const { rerender, getByTestId } = render(<Switch size="sm" />);

    const first = getByTestId('switch');
    expect(first).toBeTruthy();

    rerender(<Switch size="lg" />);

    const second = getByTestId('switch');
    expect(second).toBeTruthy();

    expect(first).toBe(second);
  });
});
