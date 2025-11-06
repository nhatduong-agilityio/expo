import { Button, Input, Text } from '@/components/ui';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>home</Text>
      <Button
        variant="outline"
        onPress={() => UnistylesRuntime.setTheme('dark')}
      >
        Button label
      </Button>
      <Button variant="secondary" loading>
        Loading...
      </Button>
      <Input placeholder="Enter text" />
      <Input
        label="Username"
        leftIcon={<Text>@</Text>}
        placeholder="Search..."
      />
      <Input
        value={'value'}
        onChangeText={() => null}
        onClear={() => console.log('')}
        showClearButton
      />
      <Input error="Invalid Username" value={'error'} />
      <Input disabled placeholder="Placeholder Text" />
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
