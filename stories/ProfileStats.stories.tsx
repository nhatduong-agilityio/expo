import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ProfileStats } from '@/components';

const meta = {
  title: 'Components/ProfileStats',
  component: ProfileStats,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof ProfileStats>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    following: 10,
    followers: 20,
    news: 30,
  },
};
