// types/chats.ts
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
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Interface for Chat
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
// types/chats.ts
export const createChat = async (participants: string[]): Promise<string> => {
  try {
    // Check if a personal chat already exists between the two users
    const existingChatQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', participants[0])
    );
    const existingChatSnapshot = await getDocs(existingChatQuery);

    let existingChatId: string | null = null;
    existingChatSnapshot.forEach((doc) => {
      const chatData = doc.data() as Chat;
      if (
        chatData.type === 'personal' &&
        chatData.participants.includes(participants[1])
      ) {
        existingChatId = doc.id;
      }
    });

    if (existingChatId) {
      return existingChatId; // Return the existing chat ID
    }

    // Create a new chat if it doesn't exist
    const chatRef = doc(collection(db, 'chats'));
    await setDoc(chatRef, {
      id: chatRef.id,
      type: 'personal',
      participants,
      createdAt: serverTimestamp(),
    });
    return chatRef.id;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

// Send a message in a chat
export const sendMessage = async (chatId: string, senderId: string, text: string): Promise<void> => {
  try {
    const messageRef = doc(collection(db, 'messages'));
    await setDoc(messageRef, {
      id: messageRef.id,
      chatId,
      senderId,
      text,
      timestamp: serverTimestamp(),
      readBy: [senderId], // Mark the message as read by the sender
    });

    // Update the chat's last message and timestamp
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessage: text,
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

// Get real-time updates for messages in a chat
export const subscribeToMessages = (
  chatId: string,
  callback: (messages: Message[]) => void
) => {
  const messagesQuery = query(
    collection(db, 'messages'),
    where('chatId', '==', chatId),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) => doc.data() as Message);
    callback(messages);
  });
};

// Get all chats for a user
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