//types/comments.ts
import { db } from '../firebaseConfig';
import { 
    doc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';
import { ProfileService } from './profiles';

// Interface for comment structure
export interface Comment {
    id: string;
    userId: string;
    username: string;
    profileImage: string;
    text: string;
    timestamp: any;
}

// Updated Post interface with commentList
export interface Post {
    id: string;
    userId: string;
    username: string;
    caption: string;
    imageUrl?: string;
    likes: number;
    comments: number;
    likedBy: string[];
    commentList: Comment[];
    timestamp: any;
}

// Comment Service functions
export const CommentService = {
    // Add a new comment
    async addComment(postId: string, userId: string, text: string): Promise<void> {
        try {
            // Get user's profile to get their profile image
            const userProfile = await ProfileService.getProfile(userId);
            if (!userProfile) {
                throw new Error('User profile not found');
            }

            // Create new comment object
            const newComment: Comment = {
                id: `${Date.now()}-${userId}`, // Generate a unique ID
                userId,
                username: userProfile.username,
                profileImage: userProfile.profileImageUrl || '',
                text,
                timestamp: serverTimestamp()
            };

            // Get the post reference
            const postRef = doc(db, 'posts', postId);
            const postDoc = await getDoc(postRef);

            if (!postDoc.exists()) {
                throw new Error('Post not found');
            }

            // Update the post with new comment
            await updateDoc(postRef, {
                commentList: arrayUnion(newComment),
                comments: (postDoc.data().comments || 0) + 1
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },

    // Delete a comment
    async deleteComment(postId: string, comment: Comment): Promise<void> {
        try {
            const postRef = doc(db, 'posts', postId);
            const postDoc = await getDoc(postRef);

            if (!postDoc.exists()) {
                throw new Error('Post not found');
            }

            await updateDoc(postRef, {
                commentList: arrayRemove(comment),
                comments: (postDoc.data().comments || 1) - 1
            });
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    },

    // Get all comments for a post
    async getComments(postId: string): Promise<Comment[]> {
        try {
            const postRef = doc(db, 'posts', postId);
            const postDoc = await getDoc(postRef);

            if (!postDoc.exists()) {
                throw new Error('Post not found');
            }

            const post = postDoc.data() as Post;
            return post.commentList || [];
        } catch (error) {
            console.error('Error getting comments:', error);
            throw error;
        }
    }
};