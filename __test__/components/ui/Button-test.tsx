import { Button } from '@/components/ui';
import { fireEvent, render } from '@testing-library/react-native';

describe('Button', () => {
  it('should match to snapshot', () => {
    const { toJSON } = render(<Button>Click me</Button>);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with the correct text', () => {
    const { getByText } = render(<Button>Click me</Button>);

    expect(getByText('Click me')).toBeTruthy();
  });

  it('should handle onPress event', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button onPress={onPressMock}>Click me</Button>,
    );
    fireEvent.press(getByText('Click me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should be disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button onPress={onPressMock} disabled>
        Click me
      </Button>,
    );
    fireEvent.press(getByText('Click me'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should be in loading state', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button onPress={onPressMock} loading>
        Click me
      </Button>,
    );
    fireEvent.press(getByTestId('button'));

    expect(onPressMock).not.toHaveBeenCalled();
    expect(getByTestId('loading')).toBeTruthy();
  });

  it('should render with different variants', () => {
    const { rerender, getByTestId } = render(
      <Button variant="primary">Primary</Button>,
    );

    const first = getByTestId('button');
    expect(first).toBeTruthy();

    rerender(<Button variant="secondary">Small</Button>);

    const second = getByTestId('button');
    expect(second).toBeTruthy();

    expect(first).toBe(second);
  });

  it('should render with different sizes', () => {
    const { rerender, getByTestId } = render(<Button size="sm">Small</Button>);

    const first = getByTestId('button');
    expect(first).toBeTruthy();

    rerender(<Button size="lg">Small</Button>);

    const second = getByTestId('button');
    expect(second).toBeTruthy();

    expect(first).toBe(second);
  });
});
