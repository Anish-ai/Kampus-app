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
            {/* Header Section */}
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

            {/* Posts Section Header */}
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
    postContainer: {
        width: (width - 20) / numColumns,
        height: (width - 20) / numColumns,
        margin: 4,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
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