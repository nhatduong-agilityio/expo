import { Avatar, Text } from '@/components/ui';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function HomeScreen() {
  const handleChange = (uri: string) => {
    console.log('New avatar selected:', uri);
  };

  return (
    <View style={styles.container}>
      <Text>home</Text>
      <Avatar
        source="https://example.com/avatar.jpg"
        editable
        onChangeImage={handleChange}
      />
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
