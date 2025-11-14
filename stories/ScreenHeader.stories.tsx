import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ScreenHeader } from '@/components';

const meta = {
  title: 'Components/ScreenHeader',
  component: ScreenHeader,
  decorators: [
    Story => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof ScreenHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Title',
  },
};

export const WithRight: Story = {
  args: {
    title: 'Title',
    rightIcon: 'search',
    showRightIcon: true,
  },
};
