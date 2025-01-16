// types/posts.ts
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
import { ProfileService } from './profiles';

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

// types/posts.ts
export interface Comment {
    id: string;
    userId: string;
    username: string;
    profileImage: string;
    text: string;
    timestamp: string;
  }

export const createPost = async (userId: string, username: string, caption: string, imageUri: string | null) => {
    let imageUrl = '';
    if (imageUri) {
        const imageRef = ref(storage, `postImages/${userId}/${Date.now()}`);
        const response = await fetch(imageUri);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
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
    const userProfileRef = doc(db, 'profiles', userId);
    await updateDoc(userProfileRef, {
        postList: arrayUnion(docRef.id),
        posts: increment(1)
    });

    return { id: docRef.id, ...postData };
};

export const getPosts = async () => {
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(postsQuery);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Post[];
};

export const toggleLike = async (postId: string, userId: string) => {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
        const postData = postDoc.data();
        const likedBy = postData.likedBy || [];
        const isLiked = likedBy.includes(userId);
        await updateDoc(postRef, {
            likes: increment(isLiked ? -1 : 1),
            likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
        });
    }
};

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

export const hasUserLikedPost = (post: Post, userId: string) => {
    return post.likedBy?.includes(userId) || false;
};

export const updateUsernameInPosts = async (userId: string, newUsername: string) => {
    const profile = await ProfileService.getProfile(userId);
    const postList = profile?.postList || [];
    const updatePromises = postList.map((postId: string) =>
        updateDoc(doc(db, 'posts', postId), { username: newUsername })
    );
    await Promise.all(updatePromises);
};

export const CommentService = {
    async addComment(postId: string, userId: string, text: string): Promise<void> {
        const userProfile = await ProfileService.getProfile(userId);
        if (!userProfile) throw new Error('User profile not found');

        const newComment: Comment = {
            id: `${Date.now()}-${userId}`,
            userId,
            username: userProfile.username,
            profileImage: userProfile.profileImageUrl || '',
            text,
            timestamp: new Date().toISOString()
        };

        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            commentList: arrayUnion(newComment),
            comments: increment(1)
        });
    },

    async deleteComment(postId: string, comment: Comment): Promise<void> {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            commentList: arrayRemove(comment),
            comments: increment(-1)
        });
    },

    async getComments(postId: string): Promise<Comment[]> {
        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);
        if (!postDoc.exists()) throw new Error('Post not found');
        const post = postDoc.data() as Post;
        return post.commentList || [];
    }
};