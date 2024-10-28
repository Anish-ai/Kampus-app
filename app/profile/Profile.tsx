import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text, Image, Button, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../context/auth';

// Define default image URLs
const defaultProfileImage = 'https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png';
const defaultHeaderImage = 'https://www.nationalflags.shop/WebRoot/vilkasfi01/Shops/2014080403/53F0/F886/BB3A/522C/CB5B/0A28/100A/2578/blue_rectangle.jpg';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
    const { user } = useAuth();

    return (
        <ScrollView style={styles.container}>
            {/* Profile Section */}
            <View style={styles.header}>
            <Image source={{ uri: user?.headerImageUrl || defaultHeaderImage }} style={styles.headerImage} />
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
                <Image source={{ uri: user?.profileImageUrl || defaultProfileImage }} style={styles.profileImage} />
                    {/* <Ionicons name="person-circle" size={100} color="#fff" style={styles.profileImage}/> */}
                </View>
                <Text style={styles.profileName}>{user?.uname}</Text>
                <Text style={styles.profileHandle}>@{user?.username}</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <Text style={styles.friendsCount}>0 Friends</Text>
                <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>
                        Hi! I'm Jatinini. I have 0 friends because no one knows me 😔
                    </Text>
                </View>
            </View>

            {/* Posts Section */}
            <View style={styles.postsContainer}>
                <Text style={styles.PostText}>Posts</Text>
                <View style={styles.postPlaceholder}>
                    <Text style={styles.postPlaceholderText}>Why would I post when I have 0 friends. 😭</Text>
                </View>
            </View>
        </ScrollView>
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
    separatingLine: {
        width: '100%',
        height: 0.2,
        backgroundColor: '#0088CC',
        marginVertical: 10,
        marginTop: 0,
    },
    postsContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',

    },
    PostText: {
        color: '#fff',
        fontSize: 30,
        fontFamily: 'Jaldi-Bold',
        alignSelf: 'flex-start',
    },
    postPlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#333',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postPlaceholderText: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Jaldi-Regular',
        fontSize: 18,
    },
});