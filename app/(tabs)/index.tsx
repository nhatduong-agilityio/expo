import { Tabs, Text } from '@/components/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('news');

  const tabs = [
    { id: 'news', label: 'News' },
    { id: 'topics', label: 'Topics' },
    { id: 'author', label: 'Author' },
  ];

  return (
    <View style={styles.container}>
      <Text>home</Text>
      <View style={{ width: '100%' }}>
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
