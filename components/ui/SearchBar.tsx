import { forwardRef, memo } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { SearchOutline } from '../icons';
import { Input, InputProps } from './Input';

export type SearchBarProps = Omit<InputProps, 'leftIcon'> & {
  onPress?: () => void;
  editable?: boolean;
};

export const SearchBar = memo(
  forwardRef<TextInput, SearchBarProps>(
    (
      {
        onPress,
        editable = true,
        accessibilityLabel,
        accessibilityHint,
        ...rest
      },
      ref,
    ) => {
      const defaultAccessibilityLabel = accessibilityLabel || 'Search';
      const defaultAccessibilityHint =
        accessibilityHint ||
        (editable ? 'Type to search' : 'Tap to open search');

      if (!editable && onPress) {
        return (
          <Pressable
            onPress={onPress}
            style={styles.pressableContainer}
            accessibilityRole="search"
            accessibilityLabel={defaultAccessibilityLabel}
            accessibilityHint={defaultAccessibilityHint}
          >
            <Input
              leftIcon={SearchOutline}
              placeholder="Search"
              editable={false}
              pointerEvents="none"
              accessibilityLabel={defaultAccessibilityLabel}
              accessibilityHint="Type to search"
              {...rest}
            />
          </Pressable>
        );
      }

      return (
        <View style={styles.container}>
          <Input
            ref={ref}
            leftIcon={SearchOutline}
            placeholder="Search"
            showClearButton
            accessibilityLabel={defaultAccessibilityLabel}
            accessibilityHint={defaultAccessibilityHint}
            required={false}
            {...rest}
          />
        </View>
      );
    },
  ),
);

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create(theme => ({
  container: {
    width: '100%',
  },
  pressableContainer: {
    width: '100%',
  },
}));
