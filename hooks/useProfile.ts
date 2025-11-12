import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authService } from '@/services';
import { useAuthStore } from '@/stores';
import { UpdateProfileInput } from '@/types';

export const PROFILE_QUERY_KEYS = {
  all: ['profile'] as const,
  detail: (userId: string) => [...PROFILE_QUERY_KEYS.all, userId] as const,
};

// Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user, setProfile } = useAuthStore();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      authService.updateProfile(user!.id, input as never),
    onSuccess: data => {
      setProfile(data);
      queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEYS.detail(user!.id),
      });
    },
  });
};
