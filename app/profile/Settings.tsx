// app/home/Feed.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth';
import { StatusBar } from 'expo-status-bar';
import { uploadImageToStorage, saveUserToFirestore } from '../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

export default function Settings() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleImageUpload = async (type: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imagePath = `users/${user?.uid}/${type}.jpg`;
      const imageUrl = await uploadImageToStorage(result.assets[0].uri, imagePath);
      await saveUserToFirestore(user?.uid, { [type === 'profile' ? 'profileImageUrl' : 'headerImageUrl']: imageUrl });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleImageUpload('profile')} style={styles.button}>
        <Text>Set Profile Image</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleImageUpload('header')} style={styles.button}>
        <Text>Set Header Image</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.email}!
        </Text>
        {/* Add your other settings here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C28',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#1C1C28',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1C1C28',
    padding: 16,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});