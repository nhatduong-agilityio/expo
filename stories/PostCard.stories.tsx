import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { PostCard } from '@/components';
import { mockNews } from '@/mocks';

const meta = {
  title: 'Components/PostCard',
  component: PostCard,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof PostCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    post: mockNews[0],
  },
};
