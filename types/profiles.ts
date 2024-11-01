import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
    increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

// Profile Interface
export interface Profile {
    userId: string;
    username: string;
    uname: string;
    bio: string;
    headerImageUrl: string;
    profileImageUrl: string;
    friends: number;
    friendsList: string[];
    posts: number;
    postList: string[];
    createdAt: any;
}

// Profile Service
export const ProfileService = {
    // Create initial profile when user signs up
    async createProfile(userId: string, username: string, uname: string): Promise<Profile> {
        try {
            const profileData: Profile = {
                userId,
                username,
                uname,
                bio: '',
                headerImageUrl: '',
                profileImageUrl: '',
                friends: 0,
                friendsList: [],
                posts: 0,
                postList: [],
                createdAt: serverTimestamp()
            };

            await setDoc(doc(db, 'profiles', userId), profileData);
            return profileData;
        } catch (error) {
            console.error('Error creating profile:', error);
            throw error;
        }
    },

    // Get profile by userId
    async getProfile(userId: string): Promise<Profile | null> {
        try {
            const profileDoc = await getDoc(doc(db, 'profiles', userId));
            return profileDoc.exists() ? profileDoc.data() as Profile : null;
        } catch (error) {
            console.error('Error getting profile:', error);
            throw error;
        }
    },

    //update uname in users collection
    async updateUser(userId: string, uname: string): Promise<void> {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { uname });
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    //update username in users collection
    async updateUsername(userId: string, username: string): Promise<void> {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { username });
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    // Update the ProfileService to handle non-existent documents
    async updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
        try {
            const profileRef = doc(db, 'profiles', userId);

            // Check if the document exists
            const profileDoc = await getDoc(profileRef);

            if (!profileDoc.exists()) {
                // If the document doesn't exist, create it with the updates
                await setDoc(profileRef, {
                    userId,
                    username: '', // Add default or existing values
                    uname: '',
                    bio: '',
                    headerImageUrl: '',
                    profileImageUrl: '',
                    friends: 0,
                    friendsList: [],
                    posts: 0,
                    postList: [],
                    createdAt: serverTimestamp(),
                    ...updates
                });
            } else {
                // If the document exists, update it
                await updateDoc(profileRef, updates);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    // Upload profile image (either header or profile)
    async uploadProfileImage(
        userId: string,
        imageUri: string,
        imageType: 'header' | 'profile'
    ): Promise<string> {
        try {
            const imageRef = ref(
                storage,
                `profileImages/${userId}/${imageType}_${Date.now()}`
            );

            const response = await fetch(imageUri);
            const blob = await response.blob();
            await uploadBytes(imageRef, blob);

            const downloadURL = await getDownloadURL(imageRef);

            // Update profile with the new image URL
            const updateField = imageType === 'header'
                ? { headerImageUrl: downloadURL }
                : { profileImageUrl: downloadURL };

            await this.updateProfile(userId, updateField);

            return downloadURL;
        } catch (error) {
            console.error(`Error uploading ${imageType} image:`, error);
            throw error;
        }
    },

    // Increment post count when user creates a post
    async incrementPostCount(userId: string): Promise<void> {
        try {
            await updateDoc(doc(db, 'profiles', userId), {
                posts: increment(1)
            });
        } catch (error) {
            console.error('Error incrementing post count:', error);
            throw error;
        }
    }
};