import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps, memo, ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Components
import { Text } from './ui';

export type ScreenHeaderProps = {
  title: string;
  leftIcon?: ComponentProps<typeof Ionicons>['name'];
  rightIcon?: ComponentProps<typeof Ionicons>['name'];
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
};

export const ScreenHeader = memo(
  ({
    title,
    leftIcon,
    rightIcon,
    onLeftPress,
    onRightPress,
    leftComponent,
    rightComponent,
    showLeftIcon = false,
    showRightIcon = false,
  }: ScreenHeaderProps) => {
    const { theme } = useUnistyles();

    return (
      <View style={styles.container}>
        {/* Left Side */}
        <View style={styles.side}>
          {leftComponent ? (
            leftComponent
          ) : showLeftIcon && leftIcon ? (
            <Pressable
              onPress={onLeftPress}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={leftIcon.replace(/-/g, ' ')}
              accessibilityHint={`Press to ${leftIcon.replace(/-/g, ' ')}`}
            >
              <Ionicons
                name={leftIcon}
                size={24}
                color={theme.colors.iconPrimary}
              />
            </Pressable>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text variant="h3" style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right Side */}
        <View style={styles.side}>
          {rightComponent ? (
            rightComponent
          ) : showRightIcon && rightIcon ? (
            <Pressable
              onPress={onRightPress}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={rightIcon.replace(/-/g, ' ')}
              accessibilityHint={`Press to ${rightIcon.replace(/-/g, ' ')}`}
            >
              <Ionicons
                name={rightIcon}
                size={24}
                color={theme.colors.iconPrimary}
              />
            </Pressable>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>
    );
  },
);

ScreenHeader.displayName = 'ScreenHeader';

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  side: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.textPrimary,
  },
  placeholder: {
    width: 24,
    height: 24,
  },
}));
