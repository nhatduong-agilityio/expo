import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { SearchBar } from '@/components/ui';

const meta = {
  title: 'UI/SearchBar',
  component: SearchBar,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof SearchBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Search',
    value: 'Value',
  },
};
