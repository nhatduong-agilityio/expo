import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Switch } from '@/components/ui';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const On: Story = {
  args: {
    value: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const OnDisabled: Story = {
  args: {
    value: true,
    disabled: true,
  },
};
