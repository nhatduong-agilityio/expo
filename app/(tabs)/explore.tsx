import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const TabTwoScreen = () => {
  return <View style={styles.titleContainer}></View>;
};

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default TabTwoScreen;
