import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { FloatButton } from '@/components/ui';

const meta = {
  title: 'UI/FloatButton',
  component: FloatButton,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof FloatButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
