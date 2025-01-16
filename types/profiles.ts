// types/profiles.ts
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
    increment,
    onSnapshot,
    query,
    collection,
    getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { Comment } from './posts';

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

export const ProfileService = {
    async createProfile(userId: string, username: string, uname: string): Promise<Profile> {
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
    },

    async getProfile(userId: string): Promise<Profile | null> {
        const profileDoc = await getDoc(doc(db, 'profiles', userId));
        return profileDoc.exists() ? profileDoc.data() as Profile : null;
    },

    async updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
        const profileRef = doc(db, 'profiles', userId);
        await updateDoc(profileRef, updates);
    },

    async uploadProfileImage(userId: string, imageUri: string, imageType: 'header' | 'profile'): Promise<string> {
        const imageRef = ref(storage, `profileImages/${userId}/${imageType}_${Date.now()}`);
        const response = await fetch(imageUri);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
        await this.updateProfile(userId, imageType === 'header' ? { headerImageUrl: downloadURL } : { profileImageUrl: downloadURL });
        return downloadURL;
    }
};

// types/profiles.ts
export const updateUsernameInComments = async (userId: string, newUsername: string) => {
    try {
      // Get all posts
      const postsQuery = query(collection(db, 'posts'));
      const postsSnapshot = await getDocs(postsQuery);
  
      // Iterate through each post
      for (const postDoc of postsSnapshot.docs) {
        const postData = postDoc.data();
        const commentList = postData.commentList || [];
  
        // Check if the user has commented on this post
        const updatedComments = commentList.map((comment: Comment) => {
          if (comment.userId === userId) {
            return { ...comment, username: newUsername }; // Update the username
          }
          return comment;
        });
  
        // If the comments were updated, save them back to Firestore
        if (JSON.stringify(updatedComments) !== JSON.stringify(commentList)) {
          await updateDoc(doc(db, 'posts', postDoc.id), {
            commentList: updatedComments,
          });
        }
      }
    } catch (error) {
      console.error('Error updating username in comments:', error);
      throw error;
    }
  };