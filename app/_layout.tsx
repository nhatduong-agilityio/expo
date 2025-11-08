import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect } from 'react';
import 'react-native-reanimated';

// Constants
import { ROUTES, SCREENS } from '@/constants';

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

  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

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
  }, [loaded, isSignedIn, segments, router]);

  if (!loaded) {
    // Async font loading only occurs in development.
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
      </Stack>
      <StatusBar style="auto" />
    </Fragment>
  );
};

export default RootLayout;
