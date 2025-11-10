import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

// Components
import { ScreenHeader } from '@/components';
import { SettingsItem } from '@/components/ui';

const SettingsScreen = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <ScreenHeader
        title="Settings"
        leftIcon="arrow-back"
        onLeftPress={handleBackPress}
        showLeftIcon
      />

      {/* Settings List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SettingsItem
          icon="notifications-outline"
          label="Notification"
          onPress={() => console.log('Notification pressed')}
        />

        <SettingsItem
          icon="lock-closed-outline"
          label="Security"
          onPress={() => console.log('Security pressed')}
        />

        <SettingsItem
          icon="help-circle-outline"
          label="Help"
          onPress={() => console.log('Help pressed')}
        />

        <SettingsItem
          icon="moon-outline"
          label="Dark Mode"
          showChevron={false}
          showSwitch
          switchValue={darkMode}
          onSwitchChange={setDarkMode}
        />

        <SettingsItem
          icon="log-out-outline"
          label="Logout"
          showChevron={false}
          onPress={handleLogout}
        />
      </ScrollView>
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
  },
}));

export default SettingsScreen;
