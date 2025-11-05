import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.stepContainer}>
      <Link href="/modal">
        <Link.Trigger>Step 2: Explore</Link.Trigger>
        <Link.Preview />
        <Link.Menu>
          <Link.MenuAction
            title="Action"
            icon="cube"
            onPress={() => alert('Action pressed')}
          />
          <Link.MenuAction
            title="Share"
            icon="square.and.arrow.up"
            onPress={() => alert('Share pressed')}
          />
          <Link.Menu title="More" icon="ellipsis">
            <Link.MenuAction
              title="Delete"
              icon="trash"
              destructive
              onPress={() => alert('Delete pressed')}
            />
          </Link.Menu>
        </Link.Menu>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
