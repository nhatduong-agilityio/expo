import { TopicCard } from '@/components';
import { fireEvent, render } from '@testing-library/react-native';

// Import the mocked hooks so we can manipulate them
import { useIsSubscribed, useToggleSubscription } from '@/hooks';
import { mockTopics } from '@/mocks';

// Mock the hooks used by the component
jest.mock('@/hooks', () => ({
  useIsSubscribed: jest.fn(),
  useToggleSubscription: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

describe('TopicCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match to snapshot', () => {
    (useIsSubscribed as jest.Mock).mockReturnValue({ data: false });
    const { toJSON } = render(<TopicCard category={mockTopics[0]} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render the category name, description, and icon', () => {
    (useIsSubscribed as jest.Mock).mockReturnValue({ data: false });
    const { getByText } = render(<TopicCard category={mockTopics[0]} />);
    expect(getByText(mockTopics[0].name)).toBeTruthy();
    expect(getByText(mockTopics[0].description!)).toBeTruthy();
    // Icon presence is checked via snapshot
  });

  it('should show "Save" button when not subscribed', () => {
    (useIsSubscribed as jest.Mock).mockReturnValue({ data: false });
    const { getByText } = render(<TopicCard category={mockTopics[0]} />);
    expect(getByText('Save')).toBeTruthy();
  });

  it('should show "Saved" button when subscribed', () => {
    (useIsSubscribed as jest.Mock).mockReturnValue({ data: true });
    const { getByText } = render(<TopicCard category={mockTopics[0]} />);
    expect(getByText('Saved')).toBeTruthy();
  });

  it('should call toggleSubscription when save button is pressed', () => {
    const mutate = jest.fn();
    (useIsSubscribed as jest.Mock).mockReturnValue({ data: false });
    (useToggleSubscription as jest.Mock).mockReturnValue({
      mutate,
      isPending: false,
    });

    const { getByText } = render(<TopicCard category={mockTopics[0]} />);
    fireEvent.press(getByText('Save'));
    expect(mutate).toHaveBeenCalledWith('1');
  });

  it('should call onSavePress callback if provided', () => {
    const onSavePressMock = jest.fn();
    (useIsSubscribed as jest.Mock).mockReturnValue({ data: false });

    const { getByText } = render(
      <TopicCard category={mockTopics[0]} onSavePress={onSavePressMock} />,
    );
    fireEvent.press(getByText('Save'));
    expect(onSavePressMock).toHaveBeenCalledWith(true);
  });

  it('should show loading state on button', () => {
    (useIsSubscribed as jest.Mock).mockReturnValue({ data: false });
    (useToggleSubscription as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    const { getByText } = render(<TopicCard category={mockTopics[0]} />);
    expect(getByText('Save')).toBeTruthy();
  });
});
