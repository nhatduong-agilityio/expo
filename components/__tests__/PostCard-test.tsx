import { PostCard } from '@/components';
import {
  useIsBookmarked,
  useIsLiked,
  useToggleBookmark,
  useToggleLike,
} from '@/hooks';
import { mockNews } from '@/mocks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

// Mock expo-router's useRouter
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock custom hooks
jest.mock('@/hooks', () => ({
  useIsBookmarked: jest.fn(),
  useIsLiked: jest.fn(),
  useToggleBookmark: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  useToggleLike: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  useIsFollowing: jest.fn(() => {
    return {
      data: false,
    };
  }),
  useToggleFollow: jest.fn(() => ({})),
}));

describe('PostCard', () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useIsBookmarked as jest.Mock).mockReturnValue({ data: false });
    (useIsLiked as jest.Mock).mockReturnValue({ data: false });
    jest.clearAllMocks();
  });

  it('should match snapshot for vertical variant', async () => {
    const { toJSON } = render(
      <PostCard post={mockNews[0]} variant="vertical" />,
    );

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should match snapshot for horizontal variant', () => {
    const { toJSON } = render(
      <PostCard post={mockNews[0]} variant="horizontal" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render post title, category, and author', () => {
    const { getByText } = render(<PostCard post={mockNews[0]} />);
    expect(getByText(mockNews[0].title)).toBeTruthy();
    expect(getByText(mockNews[0].category?.name!)).toBeTruthy();
    expect(getByText(mockNews[0].author?.fullName!)).toBeTruthy();
  });

  it('should navigate to post detail on card press', async () => {
    const { getByText } = render(<PostCard post={mockNews[0]} />);
    fireEvent.press(getByText(mockNews[0].title));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith(`/post/${mockNews[0].id}`);
    });
  });

  it('should navigate to author profile on author card press', () => {
    const { getByText } = render(<PostCard post={mockNews[0]} />);
    fireEvent.press(getByText(mockNews[0].author?.fullName!));
    expect(mockRouterPush).toHaveBeenCalledWith(
      `/author/${mockNews[0].author?.id}`,
    );
  });

  it('should toggle bookmark status', () => {
    const toggleBookmarkMock = jest.fn();
    (useToggleBookmark as jest.Mock).mockReturnValue({
      mutate: toggleBookmarkMock,
      isPending: false,
    });
    const { getByLabelText } = render(<PostCard post={mockNews[0]} />);
    fireEvent.press(getByLabelText('Bookmark post'), {
      stopPropagation: () => jest.fn(),
    });
    expect(toggleBookmarkMock).toHaveBeenCalledWith('1');
  });

  it('should toggle like status', () => {
    const toggleLikeMock = jest.fn();
    (useToggleLike as jest.Mock).mockReturnValue({
      mutate: toggleLikeMock,
      isPending: false,
    });
    const { getByLabelText } = render(<PostCard post={mockNews[0]} />);
    fireEvent.press(getByLabelText('Like post'), {
      stopPropagation: () => jest.fn(),
    });
    expect(toggleLikeMock).toHaveBeenCalledWith('1');
  });

  it('should call onMenuPress when menu button is pressed', () => {
    const onMenuPressMock = jest.fn();
    const { getByLabelText } = render(
      <PostCard post={mockNews[0]} onMenuPress={onMenuPressMock} />,
    );
    fireEvent.press(getByLabelText('More options'));
    expect(onMenuPressMock).toHaveBeenCalledTimes(1);
  });

  it('should display time ago', () => {
    const { getByText } = render(<PostCard post={mockNews[0]} />);
    // The exact time ago string depends on the current time, so we check for partial match
    expect(getByText(/ago/)).toBeTruthy();
  });
});
