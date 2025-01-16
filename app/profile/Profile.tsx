// app/profile/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Dimensions,
    ListRenderItem
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/auth';
import { ProfileService, Profile } from '../../types/profiles';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');
const numColumns = 3;

export default function ProfileScreen() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const currentUser = user;
            if (currentUser) {
                const fetchedProfile = await ProfileService.getProfile(currentUser.uid);
                setProfile(fetchedProfile);

                if (fetchedProfile && fetchedProfile.postList) {
                    const postImages: string[] = [];
                    const postsCollection = collection(db, 'posts');
                    const postsSnapshot = await getDocs(postsCollection);

                    postsSnapshot.forEach((doc) => {
                        const postData = doc.data();
                        if (fetchedProfile.postList.includes(doc.id)) {
                            postImages.push(postData.imageUrl);
                        }
                    });

                    setPosts(postImages);
                }
            }
            setLoading(false);
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    const renderPost: ListRenderItem<string> = ({ item }) => (
        <View style={styles.postContainer}>
            <Image source={{ uri: item }} style={styles.postImage} />
        </View>
    );

    const ProfileHeader = () => (
        <>
            <View style={styles.header}>
                <Image
                    source={
                        profile?.headerImageUrl
                            ? { uri: profile.headerImageUrl }
                            : require('../../assets/images/jatin.png')
                    }
                    style={styles.headerImage}
                />
                <View style={styles.headerIcons}>
                    <Ionicons name="information-circle" size={25} color="#fff" />
                    <Ionicons name="settings" size={25} color="#fff" />
                    <Ionicons name="share-social" size={25} color="#fff" />
                </View>
            </View>

            <View style={styles.profileContainer}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={
                            profile?.profileImageUrl
                                ? { uri: profile.profileImageUrl }
                                : require('../../assets/images/Jatinini.png')
                        }
                        style={styles.profileImage}
                    />
                </View>

                <Text style={styles.profileName}>{profile?.uname || user?.uname}</Text>
                <Text style={styles.profileHandle}>@{profile?.username || user?.username}</Text>

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

            <Text style={styles.PostText}>
                Posts ({profile?.posts || 0})
            </Text>
        </>
    );

    const EmptyPostsComponent = () => (
        <View style={styles.postPlaceholder}>
            <Text style={styles.postPlaceholderText}>
                No posts yet. Start sharing!
            </Text>
        </View>
    );

    return (
        <FlatList
            ListHeaderComponent={ProfileHeader}
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
            contentContainerStyle={styles.grid}
            ListEmptyComponent={EmptyPostsComponent}
            style={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    header: {
        height: 200,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 16,
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: -50,
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profileName: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
    },
    profileHandle: {
        color: '#888',
        fontSize: 16,
    },
    editButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 16,
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    friendsCount: {
        color: 'white',
        fontSize: 16,
        marginTop: 8,
    },
    bioContainer: {
        padding: 16,
    },
    bioText: {
        color: 'white',
        textAlign: 'center',
    },
    PostText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        padding: 16,
    },
    grid: {
        paddingHorizontal: 8,
    },
    postContainer: {
        width: (width - 16) / numColumns,
        height: (width - 16) / numColumns,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});