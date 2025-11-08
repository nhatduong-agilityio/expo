import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

// Components
import { SearchBar, Tabs, Text } from '@/components/ui';

// Constants
import { CONTENT_TABS, FILTER_CONTENT_TABS, ROUTES } from '@/constants';

const HomeScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(CONTENT_TABS.NEWS.ID);

  const handleSearchPress = () => {
    router.push(ROUTES.SEARCH);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchContainer}>
        <SearchBar editable={false} onPress={handleSearchPress} />
      </View>

      <View style={styles.tabsContainer}>
        <Tabs
          tabs={FILTER_CONTENT_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      <View style={styles.content}>
        <Text variant="body" color="secondary" align="center">
          Tap the search bar to start searching
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
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  tabsContainer: {
    marginBottom: theme.spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
}));

export default HomeScreen;
