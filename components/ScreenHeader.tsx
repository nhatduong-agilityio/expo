import { ComponentType, memo, ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Components
import { SvgProps } from 'react-native-svg';
import { Text } from './ui';

export type ScreenHeaderProps = {
  title: string;
  leftIcon?: ComponentType<SvgProps>;
  rightIcon?: ComponentType<SvgProps>;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  centerTitle?: boolean;
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
    centerTitle = true,
  }: ScreenHeaderProps) => {
    const { theme } = useUnistyles();

    const LeftIcon = leftIcon;
    const RightIcon = rightIcon;

    return (
      <View style={styles.container} accessibilityRole="header">
        {/* Left Side */}
        <View style={styles.side}>
          {leftComponent ? (
            leftComponent
          ) : showLeftIcon && LeftIcon ? (
            <Pressable
              onPress={onLeftPress}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Left icon"
              accessibilityHint="Tap to the left icon"
            >
              <LeftIcon />
            </Pressable>
          ) : (
            <View style={styles.placeholder} accessible={false} />
          )}
        </View>

        {/* Title */}
        <View style={[styles.titleContainer, !centerTitle && styles.titleLeft]}>
          <Text
            variant="body"
            style={styles.title}
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
          </Text>
        </View>

        {/* Right Side */}
        <View style={styles.side}>
          {rightComponent ? (
            rightComponent
          ) : showRightIcon && RightIcon ? (
            <Pressable
              onPress={onRightPress}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Right icon"
              accessibilityHint="Tap to the right icon"
            >
              <RightIcon />
            </Pressable>
          ) : (
            <View style={styles.placeholder} accessible={false} />
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
  titleLeft: {
    alignItems: 'flex-start',
  },
  title: {
    color: theme.colors.textPrimary,
  },
  placeholder: {
    width: 24,
    height: 24,
  },
}));
