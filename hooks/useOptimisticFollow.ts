import { useOptimistic, useTransition } from 'react';
import { useIsFollowing, useToggleFollow } from './useFollows';

export const useOptimisticFollow = (
  userId: string,
  initialFollowing?: boolean,
) => {
  const [isPending, startTransition] = useTransition();
  const { mutate: toggleFollow } = useToggleFollow();

  // Fetch current follow status
  const { data: isFollowingData } = useIsFollowing(userId);

  // Use server data if available, otherwise use initial value
  const serverFollowing = isFollowingData ?? initialFollowing ?? false;

  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(
    serverFollowing,
    (_state, newState: boolean) => newState,
  );

  const handleToggleFollow = () => {
    startTransition(() => {
      setOptimisticFollowing(!optimisticFollowing);
      toggleFollow(userId);
    });
  };

  return {
    isFollowing: optimisticFollowing,
    isPending,
    toggleFollow: handleToggleFollow,
  };
};
