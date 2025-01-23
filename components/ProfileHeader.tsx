// components/ProfileHeader.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router'; // Import useRouter
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../app/context/auth'; // Import useAuth
import { createChat } from '../types/chats'; // Import createChat

interface ProfileHeaderProps {
  profile: {
    userId: string; // Add userId to the profile object
    headerImageUrl?: string;
    profileImageUrl?: string;
    uname?: string;
    username?: string;
    bio?: string;
    friends?: number;
    posts?: number;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const router = useRouter();
  const { user } = useAuth(); // Get the current user

  const handleMessageButtonPress = async () => {
    if (!user || !profile) return;

    try {
      // Create a chat
      const chatId = await createChat([user.uid, profile.userId]); // Use profile.userId
      router.push(`/home/chats/${chatId}`); // Navigate to the chat screen
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={
            profile?.headerImageUrl
              ? { uri: profile.headerImageUrl }
              : require('../assets/images/jatin.png')
          }
          style={styles.headerImage}
        />
        <View style={styles.headerIcons}>
          <Ionicons name="information-circle" size={25} color="#fff" />
          <Link href="/profile/Settings">
            <Ionicons name="settings" size={25} color="#fff" />
          </Link>
          <Ionicons name="share-social" size={25} color="#fff" />
        </View>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              profile?.profileImageUrl
                ? { uri: profile.profileImageUrl }
                : require('../assets/images/Jatinini.png')
            }
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.profileName}>{profile?.uname}</Text>
        <Text style={styles.profileHandle}>@{profile?.username}</Text>

        <TouchableOpacity style={styles.editButton} onPress={handleMessageButtonPress}>
          <Text style={styles.editButtonText}>Message</Text>
        </TouchableOpacity>

        <Text style={styles.friendsCount}>{profile?.friends || 0} Friends</Text>

        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>{profile?.bio || "No bio yet"}</Text>
        </View>
      </View>

      <Text style={styles.PostText}>Posts ({profile?.posts || 0})</Text>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 140,
    backgroundColor: 'grey',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -1,
  },
  headerIcons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
    alignSelf: 'flex-end',
    gap: 15,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  profileImageContainer: {
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 55,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#3C3C3C',
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  profileName: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'Jaldi-Bold',
    marginBottom: -10,
  },
  profileHandle: {
    color: '#888',
    fontSize: 20,
    fontFamily: 'Jaldi-Regular',
  },
  editButton: {
    borderColor: '#0088CC',
    borderWidth: 1.5,
    borderRadius: 25,
    paddingVertical: 4,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontFamily: 'Jaldi-Regular',
    fontSize: 18,
  },
  friendsCount: {
    color: '#0088CC',
    fontSize: 28,
    marginVertical: 10,
    fontFamily: 'Jaldi-Regular',
  },
  bioContainer: {
    width: '100%',
    padding: 10,
    borderColor: '#3C3C3C',
    borderRadius: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  bioText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Jaldi-Regular',
    lineHeight: 25,
  },
  PostText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
});

export default ProfileHeader;