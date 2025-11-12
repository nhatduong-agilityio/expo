import { useOptimistic, useTransition } from 'react';
import { useIsLiked, useToggleLike } from './useLikes';

export const useOptimisticLike = (
  newsId: string,
  initialLiked?: boolean,
  initialLikesCount: number = 0,
) => {
  const [isPending, startTransition] = useTransition();
  const { mutate: toggleLike } = useToggleLike();

  // Fetch current like status
  const { data: isLikedData } = useIsLiked(newsId);

  // Use server data if available, otherwise use initial value
  const serverLiked = isLikedData ?? initialLiked ?? false;

  const [optimisticState, setOptimisticState] = useOptimistic(
    { isLiked: serverLiked, likesCount: initialLikesCount },
    (state, newLiked: boolean) => ({
      isLiked: newLiked,
      likesCount: newLiked
        ? state.likesCount + 1
        : Math.max(0, state.likesCount - 1),
    }),
  );

  const handleToggleLike = () => {
    startTransition(() => {
      setOptimisticState(!optimisticState.isLiked);
      toggleLike(newsId);
    });
  };

  return {
    isLiked: optimisticState.isLiked,
    likesCount: optimisticState.likesCount,
    isPending,
    toggleLike: handleToggleLike,
  };
};
