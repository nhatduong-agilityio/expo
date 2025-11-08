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

// This is a mock auth hook.
const useAuth = () => {
  return {
    isSignedIn: false,
  };
};

export default function RootLayout() {
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

    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [loaded, isSignedIn, segments, router]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Fragment>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </Fragment>
  );
}
