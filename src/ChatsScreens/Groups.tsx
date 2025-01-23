// /src/ChatsScreens/Groups.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import ChatDesign from '../../components/ChatDesign';
import { useAuth } from '../../app/context/auth';
import { getUserChats, Chat } from '../../types/chats';
import { useRouter } from 'expo-router';

const Groups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGroups = async () => {
      if (user) {
        try {
          const fetchedChats = await getUserChats(user.uid);
          const groupChats = fetchedChats.filter((chat) => chat.type === 'group'); // Filter group chats
          setGroups(groupChats);
        } catch (error) {
          console.error('Error fetching groups:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGroups();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (groups.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>No group chats found. Create a new group!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        data={groups}
        renderItem={({ item }) => (
          <ChatDesign
            type="group" // Mark as group chat
            name={item.name || 'Group Chat'} // Use group name or default
            lastMessage={item.lastMessage || 'No messages yet'}
            time={item.lastMessageTime?.toDate().toLocaleTimeString() || ''}
            unreadMessages={0} // Add logic for unread messages if needed
            senderName="" // Add sender name if needed
            onPress={() => router.push(`/home/chats/${item.id}`)} // Navigate to the group chat screen
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default Groups;