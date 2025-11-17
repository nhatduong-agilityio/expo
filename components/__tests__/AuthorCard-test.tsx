import { AuthorCard } from '@/components';
import { useIsFollowing, useToggleFollow } from '@/hooks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

// Mock the hooks used by the component
jest.mock('@/hooks', () => ({
  useIsFollowing: jest.fn(),
  useToggleFollow: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

describe('AuthorCard', () => {
  const mockAuthor = {
    authorId: '1',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.png',
    followers: 12,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match to snapshot', async () => {
    (useIsFollowing as jest.Mock).mockReturnValue({ data: false });
    const { toJSON } = await render(<AuthorCard {...mockAuthor} />);

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render the author name and avatar', () => {
    (useIsFollowing as jest.Mock).mockReturnValue({ data: false });
    const { getByText } = render(<AuthorCard {...mockAuthor} />);
    expect(getByText('John Doe')).toBeTruthy();
    // Avatar is rendered, check via snapshot
  });

  it('should show "Follow" button when not following', () => {
    (useIsFollowing as jest.Mock).mockReturnValue({ data: false });
    const { getByText } = render(<AuthorCard {...mockAuthor} />);
    expect(getByText('Follow')).toBeTruthy();
  });

  it('should show "Following" button when following', () => {
    (useIsFollowing as jest.Mock).mockReturnValue({ data: true });
    const { getByText } = render(<AuthorCard {...mockAuthor} />);
    expect(getByText('Following')).toBeTruthy();
  });

  it('should call toggleFollow when follow button is pressed', () => {
    const mutate = jest.fn();
    (useIsFollowing as jest.Mock).mockReturnValue({ data: false });
    (useToggleFollow as jest.Mock).mockReturnValue({
      mutate,
      isPending: false,
    });

    const { getByText } = render(<AuthorCard {...mockAuthor} />);
    fireEvent.press(getByText('Follow'));
    expect(mutate).toHaveBeenCalledWith('1');
  });

  it('should call onFollowPress callback if provided', () => {
    const onFollowPressMock = jest.fn();
    (useIsFollowing as jest.Mock).mockReturnValue({ data: false });

    const { getByText } = render(
      <AuthorCard {...mockAuthor} onFollowPress={onFollowPressMock} />,
    );
    fireEvent.press(getByText('Follow'));
    expect(onFollowPressMock).toHaveBeenCalledWith(true);
  });

  it('should render follower count', () => {
    (useIsFollowing as jest.Mock).mockReturnValue({ data: false });
    const { getByText } = render(<AuthorCard {...mockAuthor} />);
    expect(getByText('12 Followers')).toBeTruthy();
  });

  it('should not render follow button for size "xs"', async () => {
    (useIsFollowing as jest.Mock).mockReturnValue({ data: false });
    const { queryByText } = render(<AuthorCard {...mockAuthor} size="xs" />);

    await waitFor(() => {
      expect(queryByText('Follow')).toBeNull();
    });
  });
});
