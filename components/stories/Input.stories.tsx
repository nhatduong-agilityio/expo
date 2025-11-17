import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Input } from '@/components/ui';

const meta = {
  title: 'UI/Input',
  component: Input,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    value: 'Value',
  },
};

export const WithError: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    error: 'Error message',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    disabled: true,
  },
};
