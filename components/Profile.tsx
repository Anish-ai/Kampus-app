// /components/Profile.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ProfileProps {
  profile: {
    username: string;
    email: string;
    profileImageUrl?: string;
    headerImageUrl?: string;
    bio?: string;
    friends?: number;
    posts?: number;
    uname: string;
    // Add other profile fields as needed
  };
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <>
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

                <TouchableOpacity style={styles.editButton}>
                    <Link href="/profile/EditProfile">
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </Link>
                </TouchableOpacity>

                <Text style={styles.friendsCount}>
                    {profile?.friends || 0} Friends
                </Text>

                <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>
                        {profile?.bio || "No bio yet"}
                    </Text>
                </View>
            </View>

            {/* Posts Section Header */}
            <Text style={styles.PostText}>
                Posts ({profile?.posts || 0})
            </Text>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181818',
    },
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
    grid: {
        paddingHorizontal: 8,
        marginLeft: -10,
    },
    // postContainer: {
    //     width: (width - 20) / numColumns,
    //     height: (width - 20) / numColumns,
    //     margin: 4,
    //     backgroundColor: '#333',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    separatingLine: {
        width: '100%',
        height: 0.2,
        backgroundColor: '#0088CC',
        marginVertical: 10,
        marginTop: 0,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Profile;