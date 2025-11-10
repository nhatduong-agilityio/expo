import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

// Components
import { ScreenHeader } from '@/components';
import { Text } from '@/components/ui';

const BookmarkScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Bookmark" />
      <View style={styles.content}>
        <Text variant="h2" align="center">
          Bookmark
        </Text>
        <Text variant="body" color="secondary" align="center">
          Your saved articles will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md,
  },
}));

export default BookmarkScreen;
