import { Stack } from 'expo-router';

// Constants
import { SCREENS } from '@/constants';

const MainLayout = () => (
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
);

export default MainLayout;
