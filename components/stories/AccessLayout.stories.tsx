import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { AccessLayout } from '@/components';

const meta = {
  title: 'Components/AccessLayout',
  component: AccessLayout,
  decorators: [
    Story => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof AccessLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LoginMode: Story = {
  args: {
    mode: 'login',
  },
};

export const SignupMode: Story = {
  args: {
    mode: 'signup',
  },
};
