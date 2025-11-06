import { PostCard } from '@/components';
import { Avatar, Text } from '@/components/ui';
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
      {/* <TopicCard
        image="https://example.com/avatar.jpg"
        title="Topics"
        description="Lorem Ipsum is simply dummy text of the printing..."
        saved={false}
        onSavePress={saved => console.log('Saved:', saved)}
      />
      <AuthorCard
        avatar="https://example.com/avatar.jpg"
        name="Author"
        followers="25K Followers"
        following={false}
        onFollowPress={following => console.log('Following:', following)}
      />
      <AuthorCard
        avatar="https://example.com/avatar.jpg"
        name="BBC News"
        following={true}
        onFollowPress={following => console.log('Following:', following)}
      /> */}
      <PostCard
        variant="horizontal"
        image="https://example.com/avatar.jpg"
        category="Categories"
        title="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        authorAvatar="https://example.com/avatar.jpg"
        authorName="BBC News"
        timeAgo="4h ago"
        following={false}
        onFollowPress={following => console.log('Following:', following)}
        onPress={() => console.log('Card pressed')}
        onMenuPress={() => console.log('Menu pressed')}
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
