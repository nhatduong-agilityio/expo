import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { SettingsItem } from '@/components/ui';

const meta = {
  title: 'UI/SettingsItem',
  component: SettingsItem,
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
} satisfies Meta<typeof SettingsItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: 'settings-outline',
    label: 'Settings Item',
  },
};

export const Switch: Story = {
  args: {
    label: 'Settings Item',
    icon: 'settings-outline',
    showSwitch: true,
  },
};
