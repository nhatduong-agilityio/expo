import { Avatar, Checkbox, FloatButton, Switch, Text } from '@/components/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function HomeScreen() {
  const [isChecked, setIsChecked] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

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
      <Checkbox
        checked={isChecked}
        onChange={setIsChecked}
        label="Accept terms"
      />
      <Switch value={isEnabled} onChange={setIsEnabled} label="Notifications" />
      <FloatButton onPress={() => console.log('pressed')} />
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
