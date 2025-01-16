import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    collection, 
    query, 
    where, 
    getDocs 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';  // Add this import
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAKXPVooIceV5Nrt3bgO4gQOGWI4rol16Y",
    authDomain: "kampus-53905.firebaseapp.com",
    projectId: "kampus-53905",
    storageBucket: "kampus-53905.firebasestorage.app",
    messagingSenderId: "422476320439",
    appId: "1:422476320439:web:1d3ad08fce4da4b6614732",
    measurementId: "G-9LY4VDMWGR"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);  // Add this line

// Helper function to save user data to Firestore
export const saveUserToFirestore = async (uid, userData) => {
    try {
        await setDoc(doc(db, 'users', uid), {
            uname: userData.uname,
            username: userData.username,
            email: userData.email,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error saving user to Firestore:', error);
        throw error;
    }
};

// Helper function to check if username exists
export const checkUsernameExists = async (username) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch (error) {
        console.error('Error checking username:', error);
        throw error;
    }
};

// Helper function to get user data from Firestore
export const getUserFromFirestore = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
        console.error('Error getting user from Firestore:', error);
        throw error;
    }
};

// Helper function to persist additional user data if needed
export const saveUserToStorage = async (user) => {
    try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        console.error('Error saving user to storage:', error);
    }
};

// Helper function to get user from storage
export const getUserFromStorage = async () => {
    try {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error getting user from storage:', error);
        return null;
    }
};