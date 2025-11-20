import { Tabs } from 'expo-router';

// Constants
import { TABS } from '@/constants';

// Components
import { CustomTabBar } from '@/components';

const TabLayout = () => (
  <Tabs
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tabs.Screen
      name={TABS.HOME.NAME}
      options={{
        title: TABS.HOME.TITLE,
      }}
    />
    <Tabs.Screen
      name={TABS.EXPLORE.NAME}
      options={{
        title: TABS.EXPLORE.TITLE,
      }}
    />
    <Tabs.Screen
      name={TABS.BOOKMARK.NAME}
      options={{
        title: TABS.BOOKMARK.TITLE,
      }}
    />
    <Tabs.Screen
      name={TABS.PROFILE.NAME}
      options={{
        title: TABS.PROFILE.TITLE,
      }}
    />
  </Tabs>
);

export default TabLayout;
