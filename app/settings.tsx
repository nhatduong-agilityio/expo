import { useRouter } from 'expo-router';
import { ComponentType, useCallback, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

// Hooks
import { useAuth } from '@/hooks';

// Components
import { ScreenHeader } from '@/components';
import {
  BackOutline,
  LockOutline,
  LogoutOutline,
  MoonOutline,
  NotificationOutline,
  QuestionOutline,
} from '@/components/icons';
import { SettingsItem } from '@/components/ui';

type SettingsItemConfig = {
  id: string;
  icon: ComponentType<SvgProps>;
  label: string;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onPress?: () => void;
  onSwitchChange?: (value: boolean) => void;
};

const SettingsScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const isDarkMode = UnistylesRuntime.themeName === 'dark';
  const [darkMode, setDarkMode] = useState(isDarkMode);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleLogout = useCallback(() => {
    signOut();
  }, [signOut]);

  const handleThemeToggle = useCallback((value: boolean) => {
    setDarkMode(value);
    UnistylesRuntime.setTheme(value ? 'dark' : 'light');
  }, []);

  const handleNotificationPress = useCallback(() => {
    // TODO: Navigate to notification settings
  }, []);

  const handleSecurityPress = useCallback(() => {
    // TODO: Navigate to security settings
  }, []);

  const handleHelpPress = useCallback(() => {
    // TODO: Navigate to help/support
  }, []);

  const settingsItems: SettingsItemConfig[] = useMemo(
    () => [
      {
        id: 'notification',
        icon: NotificationOutline,
        label: 'Notification',
        onPress: handleNotificationPress,
      },
      {
        id: 'security',
        icon: LockOutline,
        label: 'Security',
        onPress: handleSecurityPress,
      },
      {
        id: 'help',
        icon: QuestionOutline,
        label: 'Help',
        onPress: handleHelpPress,
      },
      {
        id: 'darkMode',
        icon: MoonOutline,
        label: 'Dark Mode',
        showChevron: false,
        showSwitch: true,
        switchValue: darkMode,
        onSwitchChange: handleThemeToggle,
      },
      {
        id: 'logout',
        icon: LogoutOutline,
        label: 'Logout',
        showChevron: false,
        onPress: handleLogout,
      },
    ],
    [
      darkMode,
      handleNotificationPress,
      handleSecurityPress,
      handleHelpPress,
      handleThemeToggle,
      handleLogout,
    ],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Settings"
        leftIcon={BackOutline}
        onLeftPress={handleBackPress}
        showLeftIcon
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {settingsItems.map(item => (
          <SettingsItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            showChevron={item.showChevron}
            showSwitch={item.showSwitch}
            switchValue={item.switchValue}
            onPress={item.onPress}
            onSwitchChange={item.onSwitchChange}
          />
        ))}
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
  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
}));

export default SettingsScreen;
