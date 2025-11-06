import { Text } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>home</Text>
      <Button variant="outline">Button label</Button>
      <Button variant="secondary" loading>
        Loading...
      </Button>
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
