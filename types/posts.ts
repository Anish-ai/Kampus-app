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
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

// Interface for Post data
export interface Post {
  id: string;
  uname: string;
  userId: string;
  caption: string;
  imageUrl: string;
  likes: number;
  comments: number;
  likedBy: string[];
  createdAt: any;
}

// Function to create a new post
export const createPost = async (userId: string, uname: string, caption: string, imageUri: string | null) => {
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
          uname,
          caption,
          imageUrl,
          likes: 0,
          comments: 0,
          likedBy: [],
          createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'posts'), postData);
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