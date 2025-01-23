// /app/home/search/id.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, FlatList, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { getProfile } from '../../../types/profiles';
import ProfileHeader from '../../../components/ProfileHeader';

console.log('ProfileScreen component loaded'); // Simple log to verify

const { width } = Dimensions.get('window');
const numColumns = 3;

export default function ProfileScreen() {
  const { id, username } = useLocalSearchParams();
  console.log('ProfileScreen id:', id);
  console.log('ProfileScreen username:', username);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        console.log('Fetching profile for id:', id); // Debugging
        const userProfile = await getProfile(id as string);
        console.log('Fetched profile:', userProfile); // Debugging
        setProfile(userProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  const renderPost = ({ item }: { item: string }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item }} style={styles.postImage} />
    </View>
  );

  const EmptyPostsComponent = () => (
    <View style={styles.postPlaceholder}>
      <Text style={styles.postPlaceholderText}>No posts yet. Start sharing!</Text>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: username as string,
          headerShown: true,
        }}
      />

      <FlatList
        ListHeaderComponent={<ProfileHeader profile={profile} />}
        data={[]}
        renderItem={renderPost}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={EmptyPostsComponent}
        style={styles.container}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 18,
  },
  grid: {
    paddingHorizontal: 8,
    marginLeft: -10,
  },
  postContainer: {
    width: (width - 20) / numColumns,
    height: (width - 20) / numColumns,
    margin: 4,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  postPlaceholderText: {
    color: 'white',
    fontSize: 16,
  },
});