import { SearchBar } from '@/components/ui';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

describe('SearchBar', () => {
  it('should match to snapshot', async () => {
    const { toJSON } = render(<SearchBar />);
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should be editable and allow typing', async () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar onChangeText={onChangeTextMock} />,
    );
    const searchInput = getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, 'React Native');

    await waitFor(() => {
      expect(onChangeTextMock).toHaveBeenCalledWith('React Native');
    });
  });

  it('should be non-editable and handle onPress', async () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <SearchBar editable={false} onPress={onPressMock} />,
    );
    const pressable = getByRole('search');
    fireEvent.press(pressable);

    await waitFor(() => {
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should always have a search icon', async () => {
    const { getByLabelText } = render(<SearchBar />);
    // The icon itself doesn't have a direct label, but its container does.
    // We can check for the pressable area around the icon.

    await waitFor(() => {
      expect(getByLabelText('search icon')).toBeTruthy();
    });
  });

  it('should clear the input when the clear button is pressed', async () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText, getByLabelText } = render(
      <SearchBar value="testing" onChangeText={onChangeTextMock} />,
    );
    const searchInput = getByPlaceholderText('Search');

    // Focus to show the clear button
    fireEvent(searchInput, 'focus');

    const clearButton = getByLabelText('Clear input');
    fireEvent.press(clearButton);

    await waitFor(() => {
      expect(onChangeTextMock).toHaveBeenCalledWith('');
    });
  });
});
