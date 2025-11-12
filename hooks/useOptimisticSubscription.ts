import { useOptimistic, useTransition } from 'react';
import { useIsSubscribed, useToggleSubscription } from './useCategories';

export const useOptimisticSubscription = (
  categoryId: string,
  initialSubscribed?: boolean,
) => {
  const [isPending, startTransition] = useTransition();
  const { mutate: toggleSubscription } = useToggleSubscription();

  // Fetch current subscription status
  const { data: isSubscribedData } = useIsSubscribed(categoryId);

  // Use server data if available, otherwise use initial value
  const serverSubscribed = isSubscribedData ?? initialSubscribed ?? false;

  const [optimisticSubscribed, setOptimisticSubscribed] = useOptimistic(
    serverSubscribed,
    (_state, newState: boolean) => newState,
  );

  const handleToggleSubscription = () => {
    startTransition(() => {
      setOptimisticSubscribed(!optimisticSubscribed);
      toggleSubscription(categoryId);
    });
  };

  return {
    isSubscribed: optimisticSubscribed,
    isPending,
    toggleSubscription: handleToggleSubscription,
  };
};
