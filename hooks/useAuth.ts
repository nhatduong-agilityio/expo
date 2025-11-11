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

export const useAuth = () => {
  const { setSession, setProfile } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: (data: SignUpData) => authService.signUp(data),
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
