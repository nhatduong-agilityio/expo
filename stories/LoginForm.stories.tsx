import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { LoginForm } from '@/components';

const meta = {
  title: 'Components/LoginForm',
  component: LoginForm,
  decorators: [
    Story => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof LoginForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
