import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Text } from '@/components/ui';

const meta = {
  title: 'UI/Text',
  component: Text,
  decorators: [
    Story => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Text',
  },
};

export const H1: Story = {
  args: {
    children: 'Text',
    variant: 'h1',
  },
};

export const Display: Story = {
  args: {
    children: 'Text',
    variant: 'display',
  },
};

export const H2: Story = {
  args: {
    children: 'Text',
    variant: 'h2',
  },
};

export const H3: Story = {
  args: {
    children: 'Text',
    variant: 'h3',
  },
};

export const H4: Story = {
  args: {
    children: 'Text',
    variant: 'h4',
  },
};

export const Body: Story = {
  args: {
    children: 'Text',
    variant: 'body',
  },
};

export const BodySm: Story = {
  args: {
    children: 'Text',
    variant: 'bodySm',
  },
};

export const BodyLg: Story = {
  args: {
    children: 'Text',
    variant: 'bodyLg',
  },
};

export const Caption: Story = {
  args: {
    children: 'Text',
    variant: 'caption',
  },
};

export const Label: Story = {
  args: {
    children: 'Text',
    variant: 'label',
  },
};

export const Button: Story = {
  args: {
    children: 'Text',
    variant: 'button',
  },
};

export const Placeholder: Story = {
  args: {
    children: 'Text',
    variant: 'placeholder',
  },
};

export const Error: Story = {
  args: {
    children: 'Text',
    color: 'error',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Text',
    color: 'disabled',
  },
};

export const Link: Story = {
  args: {
    children: 'Text',
    color: 'link',
  },
};

export const OnPrimary: Story = {
  args: {
    children: 'Text',
    color: 'onPrimary',
  },
};

export const Accent: Story = {
  args: {
    children: 'Text',
    color: 'accent',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Text',
    color: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Text',
    color: 'tertiary',
  },
};

export const Primary: Story = {
  args: {
    children: 'Text',
    color: 'primary',
  },
};

export const Success: Story = {
  args: {
    children: 'Text',
    color: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Text',
    color: 'warning',
  },
};
