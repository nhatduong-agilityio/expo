import { memo } from 'react';
import {
  ImageSourcePropType,
  Pressable,
  PressableProps,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

// Components
import { Avatar, Button, Text } from './ui';

export type TopicCardProps = Omit<PressableProps, 'children'> & {
  image: ImageSourcePropType | string;
  title: string;
  description: string;
  saved?: boolean;
  onSavePress?: (saved: boolean) => void;
};

export const TopicCard = memo(
  ({
    image,
    title,
    description,
    saved = false,
    onSavePress,
    ...rest
  }: TopicCardProps) => {
    const handleSavePress = () => {
      onSavePress?.(!saved);
    };

    return (
      <Pressable style={styles.container} {...rest}>
        <Avatar source={image} size="lg" editable={false} rounded={false} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        </View>
        <Button
          variant={saved ? 'primary' : 'outline'}
          size="sm"
          onPress={handleSavePress}
        >
          {saved ? 'Saved' : 'Save'}
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
    ...theme.shadow.sm,
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
