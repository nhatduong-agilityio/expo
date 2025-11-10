import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect } from 'react';
import 'react-native-reanimated';

// Constants
import { ROUTES, SCREENS } from '@/constants';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// This is a mock auth hook.
const useAuth = () => {
  return {
    isSignedIn: true,
  };
};

const RootLayout = () => {
  const { isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const inAuthGroup = segments[0] === SCREENS.AUTH.LAYOUT;

    if (isSignedIn && inAuthGroup) {
      router.replace(ROUTES.HOME);
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace(ROUTES.LOGIN);
    }

    // Hide splash screen after fonts are loaded and navigation is ready
    SplashScreen.hideAsync();
  }, [loaded, isSignedIn, segments, router]);

  if (!loaded) {
    return null;
  }

  return (
    <Fragment>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.TABS.LAYOUT} />
        <Stack.Screen
          name={SCREENS.SEARCH}
          options={{
            presentation: 'containedModal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name={SCREENS.SETTINGS}
          options={{
            presentation: 'containedModal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name={SCREENS.EDIT_PROFILE}
          options={{
            presentation: 'containedModal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </Fragment>
  );
};

export default RootLayout;
