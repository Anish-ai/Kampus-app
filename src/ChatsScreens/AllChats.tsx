import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../app/context/auth';
import { getUserChats, Chat } from '../../types/chats';
import { getProfile } from '../../types/profiles'; // Import getProfile function
import ChatDesign from '../../components/ChatDesign';

const AllChats = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        try {
          const fetchedChats = await getUserChats(user.uid); // Fetch chats from Firestore

          // Fetch profile data for each chat
          const chatsWithProfileData = await Promise.all(
            fetchedChats.map(async (chat) => {
              // Find the other user's ID in the chat
              const otherUserId = chat.participants.find((id) => id !== user.uid);
              if (otherUserId) {
                // Fetch the other user's profile
                const profile = await getProfile(otherUserId);
                return {
                  ...chat,
                  name: profile?.username || 'User', // Use profile username or default
                  profileImageUrl: profile?.profileImageUrl, // Use profile image URL
                };
              }
              return chat;
            })
          );

          setChats(chatsWithProfileData);
        } catch (error) {
          console.error('Error fetching chats:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChats();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (chats.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>No chats found. Start a new conversation!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <ChatDesign
            type={item.type === 'personal' ? 'personal' : 'group'} // Ensure type matches ChatType
            name={item.name || 'Chat'} // Use chat name or default
            lastMessage={item.lastMessage || 'No messages yet'}
            time={item.lastMessageTime?.toDate().toLocaleTimeString() || ''}
            unreadMessages={0} // Add logic for unread messages if needed
            senderName="" // Add sender name if needed
            profileImageUrl={item.profileImageUrl} // Pass profile image URL
            onPress={() =>
              router.push({
                pathname: `/home/chats/${item.id}`,
                params: { name: item.name, profileImageUrl: item.profileImageUrl },
              })
            }
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default AllChats;