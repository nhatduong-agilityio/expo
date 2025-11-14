import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { TopicCard } from '@/components';
import { mockTopics } from '@/mocks';

const meta = {
  title: 'Components/TopicCard',
  component: TopicCard,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof TopicCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: mockTopics[0],
  },
};
