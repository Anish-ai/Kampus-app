import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
    increment,
    onSnapshot
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

    // Subscribe to real-time profile updates
    subscribeToProfile(userId: string, onUpdate: (profile: Profile | null) => void) {
        return onSnapshot(doc(db, 'profiles', userId), (doc) => {
            if (doc.exists()) {
                onUpdate(doc.data() as Profile);
            } else {
                onUpdate(null);
            }
        }, (error) => {
            console.error('Error subscribing to profile:', error);
            onUpdate(null);
        });
    },

    //update uname in users collection and posts
    async updateUser(userId: string, uname: string): Promise<void> {
        try {
            // Update in users collection
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { uname });
            
            // Update in profiles collection
            const profileRef = doc(db, 'profiles', userId);
            await updateDoc(profileRef, { uname });
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    //update username in users collection and posts
    async updateUsername(userId: string, username: string): Promise<void> {
        try {
            // Update in users collection
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { username });
            
            // Update in profiles collection
            const profileRef = doc(db, 'profiles', userId);
            await updateDoc(profileRef, { username });

            // Update username in all posts
            await updateUsernameInPosts(userId, username);

            // Update username in all comments
            await updateUsernameInComments(userId, username);
        } catch (error) {
            console.error('Error updating username:', error);
            throw error;
        }
    },

    // Update profile with real-time propagation
    async updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
        try {
            const profileRef = doc(db, 'profiles', userId);
            const profileDoc = await getDoc(profileRef);

            if (!profileDoc.exists()) {
                await setDoc(profileRef, {
                    userId,
                    username: '',
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
                await updateDoc(profileRef, updates);

                // If profile image is being updated, update it in all posts and comments
                if (updates.profileImageUrl) {
                    await updateProfileImageInPosts(userId, updates.profileImageUrl);
                    await updateProfileImageInComments(userId, updates.profileImageUrl);
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    // Upload profile image with real-time updates
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

// Helper function to update username in all posts
async function updateUsernameInPosts(userId: string, newUsername: string) {
    try {
        const profile = await ProfileService.getProfile(userId);
        if (!profile) return;

        const postList = profile.postList || [];
        const updatePromises = postList.map(postId =>
            updateDoc(doc(db, 'posts', postId), { username: newUsername })
        );
        await Promise.all(updatePromises);
    } catch (error) {
        console.error('Error updating username in posts:', error);
        throw error;
    }
}

// Helper function to update username in all comments
async function updateUsernameInComments(userId: string, newUsername: string) {
    try {
        const profile = await ProfileService.getProfile(userId);
        if (!profile) return;

        const postList = profile.postList || [];
        
        for (const postId of postList) {
            const postRef = doc(db, 'posts', postId);
            const postDoc = await getDoc(postRef);
            
            if (postDoc.exists()) {
                const post = postDoc.data();
                const updatedComments = post.commentList.map((comment: any) => {
                    if (comment.userId === userId) {
                        return { ...comment, username: newUsername };
                    }
                    return comment;
                });
                
                await updateDoc(postRef, { commentList: updatedComments });
            }
        }
    } catch (error) {
        console.error('Error updating username in comments:', error);
        throw error;
    }
}

// Helper function to update profile image in all posts
async function updateProfileImageInPosts(userId: string, newProfileImageUrl: string) {
    try {
        const profile = await ProfileService.getProfile(userId);
        if (!profile) return;

        const postList = profile.postList || [];
        const updatePromises = postList.map(postId =>
            updateDoc(doc(db, 'posts', postId), { profileImageUrl: newProfileImageUrl })
        );
        await Promise.all(updatePromises);
    } catch (error) {
        console.error('Error updating profile image in posts:', error);
        throw error;
    }
}

// Helper function to update profile image in all comments
async function updateProfileImageInComments(userId: string, newProfileImageUrl: string) {
    try {
        const profile = await ProfileService.getProfile(userId);
        if (!profile) return;

        const postList = profile.postList || [];
        
        for (const postId of postList) {
            const postRef = doc(db, 'posts', postId);
            const postDoc = await getDoc(postRef);
            
            if (postDoc.exists()) {
                const post = postDoc.data();
                const updatedComments = post.commentList.map((comment: any) => {
                    if (comment.userId === userId) {
                        return { ...comment, profileImage: newProfileImageUrl };
                    }
                    return comment;
                });
                
                await updateDoc(postRef, { commentList: updatedComments });
            }
        }
    } catch (error) {
        console.error('Error updating profile image in comments:', error);
        throw error;
    }
}