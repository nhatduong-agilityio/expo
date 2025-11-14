import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Avatar } from '@/components/ui';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    source: { uri: 'https://randomuser.me/api/portraits/women/43.jpg' },
  },
};

export const Small: Story = {
  args: {
    source: { uri: 'https://randomuser.me/api/portraits/women/44.jpg' },
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    source: { uri: 'https://randomuser.me/api/portraits/women/45.jpg' },
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    source: { uri: 'https://randomuser.me/api/portraits/women/46.jpg' },
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    source: { uri: 'https://randomuser.me/api/portraits/women/47.jpg' },
    size: 'xl',
  },
};
