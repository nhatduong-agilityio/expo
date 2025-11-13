import { Text } from '@/components/ui';
import { render } from '@testing-library/react-native';

describe('Text', () => {
  it('should match to snapshot', () => {
    const { toJSON } = render(
      <Text variant="body">This screen does not exist.</Text>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  test('should render correctly with text', () => {
    const { getByText } = render(<Text>Hello World</Text>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('should render with different variants', () => {
    const { rerender, getByText } = render(<Text variant="h1">Heading 1</Text>);
    expect(getByText('Heading 1')).toBeTruthy();

    rerender(<Text variant="body">Body Text</Text>);
    expect(getByText('Body Text')).toBeTruthy();

    rerender(<Text variant="caption">Caption</Text>);
    expect(getByText('Caption')).toBeTruthy();
  });

  it('should render with different colors', () => {
    const { rerender, getByText } = render(
      <Text color="primary">Primary</Text>,
    );
    expect(getByText('Primary')).toBeTruthy();

    rerender(<Text color="secondary">Secondary</Text>);
    expect(getByText('Secondary')).toBeTruthy();

    rerender(<Text color="error">Error</Text>);
    expect(getByText('Error')).toBeTruthy();
  });

  it('should render with different alignments', () => {
    const { rerender, getByText } = render(<Text align="left">Left</Text>);
    expect(getByText('Left')).toBeTruthy();

    rerender(<Text align="center">Center</Text>);
    expect(getByText('Center')).toBeTruthy();

    rerender(<Text align="right">Right</Text>);
    expect(getByText('Right')).toBeTruthy();
  });
});
