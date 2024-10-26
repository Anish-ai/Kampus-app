// app/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace this with your Firebase config object
const firebaseConfig = {
    apiKey: "AIzaSyAILLBqYxvNwnzDCegPkjKpZ97-svAwZTM",
    authDomain: "kampus-eb395.firebaseapp.com",
    projectId: "kampus-eb395",
    storageBucket: "kampus-eb395.appspot.com",
    messagingSenderId: "660924568883",
    appId: "1:660924568883:web:d5a391b7873d39c8ff5a46",
    measurementId: "G-4EKY7X4VNH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

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