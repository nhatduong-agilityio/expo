import { ProfileStats } from '@/components';
import { formatNumber } from '@/utils';
import { fireEvent, render } from '@testing-library/react-native';

// Mock the formatNumber utility
jest.mock('@/utils', () => ({
  formatNumber: jest.fn(num => num.toString()), // Simple mock for testing
}));

describe('ProfileStats', () => {
  const mockProps = {
    followers: 1234,
    following: 567,
    news: 89,
    onFollowersPress: jest.fn(),
    onFollowingPress: jest.fn(),
    onNewsPress: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match to snapshot', () => {
    const { toJSON } = render(<ProfileStats {...mockProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render the correct numbers for followers, following, and news', () => {
    const { getByText } = render(<ProfileStats {...mockProps} />);
    expect(getByText('1234')).toBeTruthy();
    expect(getByText('567')).toBeTruthy();
    expect(getByText('89')).toBeTruthy();
  });

  it('should call onFollowersPress when followers stat is pressed', () => {
    const { getByLabelText } = render(<ProfileStats {...mockProps} />);
    fireEvent.press(getByLabelText('1234 Followers'));
    expect(mockProps.onFollowersPress).toHaveBeenCalledTimes(1);
  });

  it('should call onFollowingPress when following stat is pressed', () => {
    const { getByLabelText } = render(<ProfileStats {...mockProps} />);
    fireEvent.press(getByLabelText('567 Following'));
    expect(mockProps.onFollowingPress).toHaveBeenCalledTimes(1);
  });

  it('should call onNewsPress when news stat is pressed', () => {
    const { getByLabelText } = render(<ProfileStats {...mockProps} />);
    fireEvent.press(getByLabelText('89 News'));
    expect(mockProps.onNewsPress).toHaveBeenCalledTimes(1);
  });

  it('should use the formatNumber utility', () => {
    render(<ProfileStats {...mockProps} />);
    expect(formatNumber).toHaveBeenCalledWith(mockProps.followers);
    expect(formatNumber).toHaveBeenCalledWith(mockProps.following);
    expect(formatNumber).toHaveBeenCalledWith(mockProps.news);
  });
});
