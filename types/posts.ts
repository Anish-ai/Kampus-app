import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    query,
    orderBy,
    serverTimestamp,
    onSnapshot,
    increment,
    arrayUnion,
    getDoc,
    arrayRemove
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { ProfileService } from './profiles'; // Adjust the path as necessary

// Interface for Post data
export interface Post {
    id: string;
    username: string;
    userId: string;
    caption: string;
    imageUrl: string;
    likes: number;
    comments: number;
    likedBy: string[];
    commentList: Comment[];
    createdAt: any;
}

// Interface for comment structure
export interface Comment {
    id: string;
    userId: string;
    username: string;
    profileImage: string;
    text: string;
    timestamp: string; // Changed from 'any' to 'string'
}

// Function to create a new post
export const createPost = async (userId: string, username: string, caption: string, imageUri: string | null) => {
    try {
        let imageUrl = '';
        if (imageUri) {
            // Generate a reference for the image
            const imageRef = ref(storage, `postImages/${userId}/${Date.now()}`);

            // Convert URI to a Blob and upload it
            const response = await fetch(imageUri);
            const blob = await response.blob();
            await uploadBytes(imageRef, blob);

            // Get the downloadable URL
            imageUrl = await getDownloadURL(imageRef);
        }

        const postData = {
            userId,
            username,
            caption,
            imageUrl,
            likes: 0,
            comments: 0,
            likedBy: [],
            commentList: [],
            createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'posts'), postData);

        // Update user's profile postList with the new post ID
        const userProfileRef = doc(db, 'profiles', userId);
        await updateDoc(userProfileRef, {
            postList: arrayUnion(docRef.id)
        });
        // Increment the post count in user's profile
        await updateDoc(userProfileRef, {
            posts: increment(1)
        });

        return { id: docRef.id, ...postData };
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

// Function to get all posts
export const getPosts = async () => {
    try {
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(postsQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Post[];
    } catch (error) {
        console.error('Error getting posts:', error);
        throw error;
    }
};

// Function to handle post likes
export const toggleLike = async (postId: string, userId: string) => {
    try {
        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDocs(query(collection(db, 'posts')));
        const post = postDoc.docs.find(doc => doc.id === postId);

        if (post) {
            const postData = post.data();
            const likedBy = postData.likedBy || [];
            const isLiked = likedBy.includes(userId);

            if (isLiked) {
                // Unlike the post
                await updateDoc(postRef, {
                    likes: increment(-1),
                    likedBy: likedBy.filter((id: string) => id !== userId)
                });
            } else {
                // Like the post
                await updateDoc(postRef, {
                    likes: increment(1),
                    likedBy: [...likedBy, userId]
                });
            }
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};

// Function to subscribe to real-time post updates
export const subscribeToPosts = (onUpdate: (posts: Post[]) => void) => {
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    return onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Post[];
        onUpdate(posts);
    });
};

// Function to check if user has liked a post
export const hasUserLikedPost = (post: Post, userId: string) => {
    return post.likedBy?.includes(userId) || false;
};

export const updateUsernameInPosts = async (userId: string, newUsername: string) => {
    try {
        // Step 1: Retrieve user's postList from profiles db
        const profile = await ProfileService.getProfile(userId);
        const postList = profile?.postList || [];

        // Step 2: Update username in each post document in posts db
        const updatePromises = postList.map((postId: string) =>
            updateDoc(doc(db, 'posts', postId), { username: newUsername })
        );
        await Promise.all(updatePromises); // Execute all updates concurrently
        console.log(`Username updated in ${postList.length} posts`);
    } catch (error) {
        console.error('Error updating username in posts:', error);
        throw error;
    }
};

// Comment Service functions
export const CommentService = {
    // Add a new comment
    // Function to add a new comment
    async addComment(postId: string, userId: string, text: string): Promise<void> {
        try {
            // Get user's profile to get their profile image
            const userProfile = await ProfileService.getProfile(userId);
            if (!userProfile) {
                throw new Error('User profile not found');
            }

            // Create new comment object WITHOUT serverTimestamp()
            const newComment: Comment = {
                id: `${Date.now()}-${userId}`, // Generate a unique ID
                userId,
                username: userProfile.username,
                profileImage: userProfile.profileImageUrl || '',
                text,
                timestamp: new Date().toISOString() // Use ISO string instead
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
                comments: increment(1)
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