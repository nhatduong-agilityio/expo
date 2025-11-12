import { useOptimistic, useTransition } from 'react';
import { useIsBookmarked, useToggleBookmark } from './useBookmarks';

export const useOptimisticBookmark = (
  newsId: string,
  initialBookmarked?: boolean,
) => {
  const [isPending, startTransition] = useTransition();
  const { mutate: toggleBookmark } = useToggleBookmark();

  // Fetch current bookmark status
  const { data: isBookmarkedData } = useIsBookmarked(newsId);

  // Use server data if available, otherwise use initial value
  const serverBookmarked = isBookmarkedData ?? initialBookmarked ?? false;

  const [optimisticBookmarked, setOptimisticBookmarked] = useOptimistic(
    serverBookmarked,
    (_state, newState: boolean) => newState,
  );

  const handleToggleBookmark = () => {
    startTransition(() => {
      setOptimisticBookmarked(!optimisticBookmarked);
      toggleBookmark(newsId);
    });
  };

  return {
    setOptimisticBookmarked,
    isBookmarked: optimisticBookmarked,
    isPending,
    toggleBookmark: handleToggleBookmark,
  };
};
