import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

// Constants
import { ROUTES } from '@/constants';

// Services
import { SignInData, SignUpData } from '@/types';

// Services
import { authService } from '@/services';
import { secureStorage } from '@/services/secureStorage';

// Stores
import { useAuthStore } from '@/stores';

export const useAuth = () => {
  const { setUser, setProfile } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpData) => {
      const result = await authService.signUp(data);

      // Store remember me preference securely if enabled
      if (data.rememberMe) {
        await secureStorage.setRememberMeEnabled(true);
        await secureStorage.setRememberMeEmail(data.email);
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
      // Only store non-sensitive user data in store
      setUser(data.session?.user || null);

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
      setUser(null);
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
