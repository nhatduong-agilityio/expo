import { memo } from 'react';
import {
  GestureResponderEvent,
  Platform,
  Pressable,
  PressableProps,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

// Hooks
import { useIsSubscribed, useToggleSubscription } from '@/hooks';

// Types
import { Category } from '@/types';

// Components
import { Avatar, Button, Text } from './ui';

export type TopicCardProps = Omit<PressableProps, 'children'> & {
  category: Category;
  onSavePress?: (saved: boolean) => void;
};

export const TopicCard = memo(
  ({ category, onSavePress, ...rest }: TopicCardProps) => {
    // Check subscription status
    const { data: isSubscribed } = useIsSubscribed(category.id);
    const { mutate: toggleSubscription, isPending } = useToggleSubscription();

    const handleSavePress = (event: GestureResponderEvent) => {
      event.stopPropagation();
      if (onSavePress) {
        onSavePress(!isSubscribed);
      } else {
        toggleSubscription(category.id);
      }
    };

    return (
      <Pressable style={styles.container} {...rest}>
        <Avatar
          source={category.iconUrl || 'https://picsum.photos/100/100?random=10'}
          size="lg"
          editable={false}
          rounded={false}
        />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {category.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {category.description}
          </Text>
        </View>
        <Button
          variant={isSubscribed ? 'primary' : 'outline'}
          size="sm"
          onPress={handleSavePress}
          loading={isPending}
        >
          {isSubscribed ? 'Saved' : 'Save'}
        </Button>
      </Pressable>
    );
  },
);

TopicCard.displayName = 'TopicCard';

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'ios' && theme.shadow.sm),
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.textPrimary,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.sm,
  },
}));
