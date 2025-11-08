import { Tabs } from 'expo-router';

// Constants
import { TABS } from '@/constants';

const TabLayout = () => {
  return (
    <Tabs
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
    </Tabs>
  );
};

export default TabLayout;
