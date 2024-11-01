// UserService.ts
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// User Interface
export interface User {
    userId: string;
    uname: string;
    username: string;
    // Add other user fields as needed
}

// User Service
export const UserService = {
    // Update user in users collection
    async updateUser(userId: string, updates: Partial<User>): Promise<void> {
        try {
            const userRef = doc(db, 'users', userId);

            // Check if the document exists
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
                console.error('User document does not exist:', userId);
                return;
            }

            // Update the user document
            await updateDoc(userRef, updates);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },
};
