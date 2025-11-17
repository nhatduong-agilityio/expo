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
import { ActivityIndicator, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

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

const StorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export const unstable_settings = {
  initialRouteName: StorybookEnabled ? SCREENS.STORYBOOK : SCREENS.AUTH.LAYOUT,
};

const RootLayout = () => {
  const { isAuthenticated, setUser, setProfile, isLoading, setLoading } =
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

  // Initialize auth
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session (from secure storage)
        const session = await authService.getSession();

        // Only store non-sensitive user data
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            const profile = await authService.getProfile(session.user.id);
            setProfile(profile);
          } catch (profileError) {
            console.error('Failed to fetch profile:', profileError);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // Only store non-sensitive user data
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          const profile = await authService.getProfile(session.user.id);
          setProfile(profile);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setLoading, setProfile, setUser]);

  // Perform navigation
  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === SCREENS.AUTH.LAYOUT;

    if (isAuthenticated && inAuthGroup) {
      router.replace(ROUTES.HOME);
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace(ROUTES.LOGIN);
    }

    // Hide splash screen
    SplashScreen.hideAsync();
  }, [isLoading, isAuthenticated, segments, router]);

  if (!loaded) {
    return null;
  }

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Storybook - Only accessible when enabled */}
          <Stack.Protected guard={StorybookEnabled}>
            <Stack.Screen name={SCREENS.STORYBOOK} />
          </Stack.Protected>

          {/* Auth screens - Only accessible when NOT authenticated */}
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name={SCREENS.AUTH.LAYOUT} />
          </Stack.Protected>

          {/* Protected screens - Only accessible when authenticated */}
          <Stack.Protected guard={isAuthenticated}>
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
          </Stack.Protected>
        </Stack>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </Fragment>
  );
};

const styles = StyleSheet.create(theme => ({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
}));

export default RootLayout;
