import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { AuthorCard } from '@/components';
import { mockAuthors } from '@/mocks';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/AuthorCard',
  component: AuthorCard,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: { onPress: () => fn() },
} satisfies Meta<typeof AuthorCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    authorId: mockAuthors[0].id,
    avatar: mockAuthors[0].avatarUrl || '',
    name: mockAuthors[0].fullName || '',
    followers: mockAuthors[0].followersCount,
    following: mockAuthors[0].following,
  },
};
