import { forwardRef, memo } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Input, InputProps } from './Input';

export type SearchBarProps = Omit<InputProps, 'leftIcon'> & {
  onPress?: () => void;
  editable?: boolean;
};

export const SearchBar = memo(
  forwardRef<TextInput, SearchBarProps>(
    ({ onPress, editable = true, ...rest }, ref) => {
      if (!editable && onPress) {
        return (
          <Pressable onPress={onPress} style={styles.pressableContainer}>
            <Input
              leftIcon="search"
              placeholder="Search"
              editable={false}
              pointerEvents="none"
              {...rest}
            />
          </Pressable>
        );
      }

      return (
        <View style={styles.container}>
          <Input
            ref={ref}
            leftIcon="search"
            placeholder="Search"
            showClearButton
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
