import {
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect } from 'react';

// Constants
import { ROUTES, SCREENS } from '@/constants';

// Services
import { authService, supabase } from '@/services';

// Stores
import { useAuthStore } from '@/stores';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

const RootLayout = () => {
  const { isAuthenticated, setSession, setProfile, setLoading } =
    useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_400Regular_Italic,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    // Check for existing session
    authService.getSession().then(session => {
      setSession(session);
      if (session?.user) {
        authService.getProfile(session.user.id).then(setProfile);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const profile = await authService.getProfile(session.user.id);
        setProfile(profile);
      }
    });

    return () => subscription.unsubscribe();
  }, [setLoading, setProfile, setSession]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const inAuthGroup = segments[0] === SCREENS.AUTH.LAYOUT;

    if (isAuthenticated && inAuthGroup) {
      router.replace(ROUTES.HOME);
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace(ROUTES.LOGIN);
    }

    // Hide splash screen after fonts are loaded and navigation is ready
    SplashScreen.hideAsync();
  }, [loaded, isAuthenticated, segments, router]);

  if (!loaded) {
    return null;
  }

  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
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
          <Stack.Screen
            name={SCREENS.AUTHOR_PROFILE}
            options={{
              presentation: 'containedModal',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name={SCREENS.POST_DETAIL}
            options={{
              presentation: 'containedModal',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name={SCREENS.CREATE_POST}
            options={{
              presentation: 'containedModal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </Fragment>
  );
};

export default RootLayout;
