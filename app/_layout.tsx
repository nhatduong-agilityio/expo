import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

// Constants
import { ROUTES, SCREENS } from '@/constants';

// This is a mock auth hook.
const useAuth = () => {
  return {
    isSignedIn: true,
  };
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const RootLayout = () => {
  const { isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);

  const [loaded, error] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    const prepare = async () => {
      if (loaded || error) {
        // Simulate loading time - REMOVE THIS IN PRODUCTION
        // This helps you see the splash screen for testing
        await new Promise(resolve => setTimeout(resolve, 3000));

        setAppIsReady(true);
      }
    };

    prepare();
  }, [loaded, error]);

  useEffect(() => {
    if (!appIsReady) {
      return;
    }

    const inAuthGroup = segments[0] === SCREENS.AUTH.LAYOUT;

    if (isSignedIn && inAuthGroup) {
      router.replace(ROUTES.HOME);
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace(ROUTES.LOGIN);
    }
  }, [appIsReady, isSignedIn, segments, router]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide the splash screen after the app is ready
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.TABS.LAYOUT} />
        <Stack.Screen
          name={SCREENS.SEARCH}
          options={{
            presentation: 'containedModal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
};

export default RootLayout;
