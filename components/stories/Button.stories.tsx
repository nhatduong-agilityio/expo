import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';
import { fn } from 'storybook/test';

import { Button } from '@/components/ui';

const meta = {
  title: 'UI/Button',
  component: Button,
  decorators: [
    Story => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // Use `fn` to spy on the onPress arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onPress: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Button',
  },
};

export const Disabled: Story = {
  args: {
    size: 'lg',
    children: 'Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    size: 'lg',
    children: 'Button',
    loading: true,
  },
};
