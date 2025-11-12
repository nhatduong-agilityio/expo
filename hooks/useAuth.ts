import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

// Constants
import { ROUTES } from '@/constants';

// Services
import { SignInData, SignUpData } from '@/types';

// Services
import { authService } from '@/services';

// Stores
import { useAuthStore } from '@/stores';

const REMEMBER_ME_KEY = '@news_app_remember_me';
const REMEMBERED_EMAIL_KEY = '@news_app_remembered_email';

export const useAuth = () => {
  const { setSession, setProfile } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpData) => {
      const result = await authService.signUp(data);

      // Store remember me preference for signup
      if (data.rememberMe) {
        await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');
        await AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, data.email);
      }

      return result;
    },
    onSuccess: () => {
      router.replace(ROUTES.LOGIN);
    },
  });

  const signInMutation = useMutation({
    mutationFn: (data: SignInData) => authService.signIn(data),
    onSuccess: async data => {
      setSession(data.session);
      if (data.session?.user) {
        const profile = await authService.getProfile(data.session.user.id);
        setProfile(profile);
      }
      router.replace(ROUTES.HOME);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      queryClient.clear();
      setSession(null);
      setProfile(null);
    },
  });

  return {
    signUp: signUpMutation.mutate,
    signIn: signInMutation.mutate,
    signOut: signOutMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    signUpError: signUpMutation.error,
    signInError: signInMutation.error,
  };
};
