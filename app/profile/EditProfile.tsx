import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator  // Add this import
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ProfileService } from '../../types/profiles';
import { auth, db } from '../../firebaseConfig';
import { UserService } from '../../types/UserService';
import { doc, updateDoc } from 'firebase/firestore';
import { updateUsernameInPosts } from '../../types/posts';
import { checkUsernameExists } from '../../firebaseConfig';

const EditProfileScreen = () => {
    // Existing state
    const [uname, setUname] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [headerImage, setHeaderImage] = useState<string | null>(null);

    // Add new state for loading and errors
    const [isLoading, setIsLoading] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [errors, setErrors] = useState({
        uname: '',
        username: '',
        bio: ''
    });

    // Add form validation
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            uname: '',
            username: '',
            bio: ''
        };

        if (!uname.trim()) {
            newErrors.uname = 'Name is required';
            isValid = false;
        }

        if (!username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
            isValid = false;
        }

        if (bio && bio.length > 150) {
            newErrors.bio = 'Bio must be less than 150 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Update existing useEffect
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true); // Add loading state
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    const fetchedProfile = await ProfileService.getProfile(currentUser.uid);
                    if (fetchedProfile) {
                        setUname(fetchedProfile.uname);
                        setUsername(fetchedProfile.username);
                        setBio(fetchedProfile.bio);
                        setProfileImage(fetchedProfile.profileImageUrl);
                        setHeaderImage(fetchedProfile.headerImageUrl);
                    }
                } catch (error) {
                    Alert.alert('Error', 'Failed to fetch profile');
                } finally {
                    setIsLoading(false); // Clear loading state
                }
            }
        };

        fetchProfile();
    }, []);

    // Update existing pickImage function
    const pickImage = async (type: 'profile' | 'header') => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please grant access to your photo library to upload images.'
            );
            return;
        }

        setIsImageUploading(true); // Add loading state
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: type === 'profile' ? [1, 1] : [3, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const uploadedImageUrl = await ProfileService.uploadProfileImage(
                    auth.currentUser!.uid,
                    imageUri,
                    type
                );

                if (type === 'profile') {
                    setProfileImage(uploadedImageUrl);
                } else {
                    setHeaderImage(uploadedImageUrl);
                }
            }
        } catch (error) {
            Alert.alert('Upload Error', 'Failed to upload image');
        } finally {
            setIsImageUploading(false); // Clear loading state
        }
    };

    // Update existing handleSaveProfile function
    const handleSaveProfile = async () => {
        if (!auth.currentUser) return;
        if (!validateForm()) return;

        // Check if username exists
        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                username: 'Username already exists'
            }));
            return;
        }

        setIsLoading(true); // Add loading state
        try {
            await ProfileService.updateProfile(auth.currentUser.uid, {
                uname,
                username,
                bio
            });
            await UserService.updateUser(auth.currentUser.uid, { uname, username });

            await updateUsernameInPosts(auth.currentUser.uid, username);

            Alert.alert('Success', 'Profile updated successfully');
            router.replace('/home');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setIsLoading(false); // Clear loading state
        }
    };

    // Show loading screen while initial data is being fetched
    if (isLoading && !uname && !username) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header Image Section */}
            <TouchableOpacity
                onPress={() => pickImage('header')}
                style={styles.headerImageContainer}
            >
                {headerImage ? (
                    <Image source={{ uri: headerImage }} style={styles.headerImage} />
                ) : (
                    <View style={styles.placeholderHeader}>
                        <Ionicons name="image-outline" size={50} color="white" />
                        <Text style={styles.placeholderText}>Add Header Image</Text>
                    </View>
                )}
                {isImageUploading && (
                    <View style={styles.uploadingOverlay}>
                        <ActivityIndicator color="#fff" />
                        <Text style={styles.uploadingText}>Uploading...</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Profile Image Section */}
            <TouchableOpacity
                onPress={() => pickImage('profile')}
                style={styles.profileImageContainer}
            >
                {profileImage ? (
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImage}
                    />
                ) : (
                    <Ionicons name="person-circle-outline" size={100} color="white" />
                )}
            </TouchableOpacity>

            {/* Profile Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={[styles.input, errors.uname ? styles.inputError : null]}
                    value={uname}
                    onChangeText={setUname}
                    placeholder="Enter your name"
                    placeholderTextColor="#888"
                />
                {errors.uname ? (
                    <Text style={styles.errorText}>{errors.uname}</Text>
                ) : null}
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={[styles.input, errors.username ? styles.inputError : null]}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                    placeholderTextColor="#888"
                />
                {errors.username ? (
                    <Text style={styles.errorText}>{errors.username}</Text>
                ) : null}

                <Text style={styles.label}>Bio</Text>
                <TextInput
                    style={[
                        styles.input,
                        styles.bioInput,
                        errors.bio ? styles.inputError : null
                    ]}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell us about yourself"
                    placeholderTextColor="#888"
                    multiline
                    numberOfLines={4}
                />
                {errors.bio ? (
                    <Text style={styles.errorText}>{errors.bio}</Text>
                ) : null}

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveProfile}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Profile</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Global loading overlay */}
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            )}
        </ScrollView>
    );
};

// Update styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    headerImageContainer: {
        height: 200,
        width: '100%',
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderHeader: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: 'white',
        marginTop: 10,
    },
    profileImageContainer: {
        position: 'absolute',
        top: 150,
        left: 20,
        zIndex: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'white',
    },
    detailsContainer: {
        marginTop: 70,
        padding: 20,
    },
    label: {
        color: 'white',
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#333',
        color: 'white',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadingText: {
        color: '#fff',
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -12,
        marginBottom: 8,
    },
    inputError: {
        borderColor: 'red',
    },
});

export default EditProfileScreen;