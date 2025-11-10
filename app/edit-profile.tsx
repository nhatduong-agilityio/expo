import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

// Components
import { ScreenHeader } from '@/components';
import { Avatar, Input } from '@/components/ui';

const EditProfileScreen = () => {
  const router = useRouter();

  const [username, setUsername] = useState('wilsonfranci');
  const [fullName, setFullName] = useState('Wilson Franci');
  const [email, setEmail] = useState('example@youremail.com');
  const [phone, setPhone] = useState('+62-8421-4512-2531');
  const [bio, setBio] = useState(
    'Lorem Ipsum is simply dummy text of the printing',
  );
  const [website, setWebsite] = useState('https://yourwebsite.com');

  const handleBackPress = () => {
    router.back();
  };

  const handleSavePress = () => {
    // Handle save logic
    console.log('Save pressed');
    router.back();
  };

  const handleAvatarChange = (uri: string) => {
    console.log('Avatar changed:', uri);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <ScreenHeader
        title="Edit Profile"
        leftIcon="close"
        rightIcon="checkmark"
        onLeftPress={handleBackPress}
        onRightPress={handleSavePress}
        showLeftIcon
        showRightIcon
      />

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Avatar
            source="https://picsum.photos/200/200?random=1"
            size="xl"
            editable
            onChangeImage={handleAvatarChange}
          />
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            autoCapitalize="none"
          />

          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full Name"
          />

          <Input
            label="Email Address*"
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Phone Number*"
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />

          <Input
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Bio"
            multiline
            numberOfLines={3}
          />

          <Input
            label="Website"
            value={website}
            onChangeText={setWebsite}
            placeholder="Website"
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing['3xl'],
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  form: {
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
}));

export default EditProfileScreen;
