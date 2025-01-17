import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface Chat {
    id: string;
    type: 'personal' | 'group'; // Distinguish between personal and group chats
    participants: string[]; // Array of user IDs
    name?: string; // Optional: Name of the group chat (only for group chats)
    createdAt: any; // Firestore timestamp
    lastMessage?: string;
    lastMessageTime?: any; // Firestore timestamp
  }

// Interface for Message
export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    timestamp: any; // Firestore timestamp
    readBy: string[]; // Array of user IDs
}

// Create a new chat (automatically creates the 'chats' collection if it doesn't exist)
export const createChat = async (chatData: Chat): Promise<string> => {
    try {
      // Validate participants for personal chats
      if (chatData.type === 'personal' && chatData.participants.length !== 2) {
        throw new Error('Personal chats must have exactly 2 participants.');
      }
  
      // Validate participants for group chats
      if (chatData.type === 'group' && chatData.participants.length < 2) {
        throw new Error('Group chats must have at least 2 participants.');
      }
  
      // Validate name for group chats
      if (chatData.type === 'group' && !chatData.name) {
        throw new Error('Group chats must have a name.');
      }
  
      const chatRef = doc(collection(db, 'chats')); // Automatically creates 'chats' collection
      await setDoc(chatRef, {
        ...chatData,
        id: chatRef.id,
        createdAt: serverTimestamp(),
      });
      return chatRef.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  };

// Send a message in a chat (automatically creates the 'messages' collection if it doesn't exist)
export const sendMessage = async (messageData: Message): Promise<void> => {
    try {
        const messageRef = doc(collection(db, 'messages')); // Automatically creates 'messages' collection
        await setDoc(messageRef, {
            ...messageData,
            id: messageRef.id,
            timestamp: serverTimestamp(),
        });

        // Update the chat's last message and timestamp
        const chatRef = doc(db, 'chats', messageData.chatId);
        await updateDoc(chatRef, {
            lastMessage: messageData.text,
            lastMessageTime: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Get all messages for a chat
export const getMessages = async (chatId: string): Promise<Message[]> => {
    try {
        const messagesQuery = query(
            collection(db, 'messages'),
            where('chatId', '==', chatId),
            orderBy('timestamp', 'asc')
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        return messagesSnapshot.docs.map((doc) => doc.data() as Message);
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

// Mark a message as read
export const markMessageAsRead = async (messageId: string, userId: string): Promise<void> => {
    try {
        const messageRef = doc(db, 'messages', messageId);
        await updateDoc(messageRef, {
            readBy: arrayUnion(userId),
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        throw error;
    }
};

export const getUserChats = async (userId: string): Promise<Chat[]> => {
    try {
      const chatsQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId)
      );
      const chatsSnapshot = await getDocs(chatsQuery);
      return chatsSnapshot.docs.map((doc) => doc.data() as Chat);
    } catch (error) {
      console.error('Error fetching user chats:', error);
      throw error;
    }
  };

  export const getPersonalChats = async (userId: string): Promise<Chat[]> => {
    try {
      const chatsQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId),
        where('type', '==', 'personal')
      );
      const chatsSnapshot = await getDocs(chatsQuery);
      return chatsSnapshot.docs.map((doc) => doc.data() as Chat);
    } catch (error) {
      console.error('Error fetching personal chats:', error);
      throw error;
    }
  };

  export const getGroupChats = async (userId: string): Promise<Chat[]> => {
    try {
      const chatsQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId),
        where('type', '==', 'group')
      );
      const chatsSnapshot = await getDocs(chatsQuery);
      return chatsSnapshot.docs.map((doc) => doc.data() as Chat);
    } catch (error) {
      console.error('Error fetching group chats:', error);
      throw error;
    }
  };