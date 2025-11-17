import { Avatar } from '@/components/ui';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';

describe('Avatar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match to snapshot', async () => {
    const { toJSON } = render(<Avatar />);

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render default avatar when no source is provided', async () => {
    const { getByLabelText } = render(<Avatar />);

    await waitFor(() => {
      expect(getByLabelText('Avatar')).toBeTruthy();
    });
  });

  it('should render image when source is provided', async () => {
    const { getByRole } = render(
      <Avatar source={{ uri: 'https://example.com/avatar.png' }} />,
    );
    const image = getByRole('image');

    await waitFor(() => {
      expect(image).toBeTruthy();
    });
  });

  it('should render fallback label when provided and no source', async () => {
    const { getByText } = render(<Avatar fallbackLabel="JD" />);

    await waitFor(() => {
      expect(getByText('JD')).toBeTruthy();
    });
  });

  it('should be editable and show camera icon', async () => {
    const { getByLabelText } = render(<Avatar editable />);

    await waitFor(() => {
      expect(getByLabelText('Change avatar')).toBeTruthy();
    });
  });

  it('should open image library on press when editable', async () => {
    const launchImageLibraryAsync =
      ImagePicker.launchImageLibraryAsync as jest.Mock;
    launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///new-avatar.png' }],
    });

    const onChangeImage = jest.fn();
    const { getByRole } = render(
      <Avatar editable onChangeImage={onChangeImage} />,
    );

    fireEvent.press(getByRole('button'));

    await await waitFor(() => {
      expect(launchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    });
  });

  it('should render with different sizes', () => {
    const { rerender, getByTestId } = render(<Avatar size="sm" />);

    const smAvatar = getByTestId('avatar-wrapper');
    expect(smAvatar).toBeTruthy();

    rerender(<Avatar size="lg" />);

    const lgAvatar = getByTestId('avatar-wrapper');
    expect(lgAvatar).toBeTruthy();

    expect(smAvatar).toBe(lgAvatar);
  });

  it('should render with rounded or square shape', () => {
    const { rerender, getByTestId } = render(<Avatar rounded />);

    const roundedAvatar = getByTestId('avatar-wrapper');
    expect(roundedAvatar).toBeTruthy();

    rerender(<Avatar />);

    const lgAvatar = getByTestId('avatar-wrapper');
    expect(lgAvatar).toBeTruthy();

    expect(roundedAvatar).toBe(lgAvatar);
  });
});
