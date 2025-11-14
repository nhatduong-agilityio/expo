import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Checkbox } from '@/components/ui';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Checkbox',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    label: 'Checked Disabled',
    checked: true,
    disabled: true,
  },
};
