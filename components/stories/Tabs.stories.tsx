import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Tabs } from '@/components/ui';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {
    onTabChange: () => fn(),
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      { id: '1', label: 'Tab 1' },
      { id: '2', label: 'Tab 2' },
      { id: '3', label: 'Tab 3' },
    ],
    activeTab: '1',
  },
};
