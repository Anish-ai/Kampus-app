// /src/ChatsScreens/Groups.tsx
import React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import ChatDesign from '../../components/ChatDesign';
import { chatData } from './AllChats';  // Import chatData from AllChats

const GroupChats = () => {
  // Filter only group chats
  const groupChats = chatData.filter((chat) => chat.type === 'group');

  return (
    <SafeAreaView>
      <FlatList
        data={groupChats}
        renderItem={({ item }) => (
          <ChatDesign
            type={item.type}
            name={item.name}
            lastMessage={item.lastMessage}
            time={item.time}
            unreadMessages={item.unreadMessages}
            senderName={item.senderName}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default GroupChats;