// /src/ChatsScreens/AllChats.tsx
import React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import ChatDesign from '../../components/ChatDesign';

type ChatType = 'personal' | 'group';

const chatData: { id: string; type: ChatType; name: string; lastMessage: string; time: string; unreadMessages: number; senderName: string; }[] = [
  {
    id: '1',
    type: 'personal',
    name: 'User',
    lastMessage: 'Your runtime has been disconnected...',
    time: '06:09',
    unreadMessages: 69,
    senderName: '',
  },
  {
    id: '2',
    type: 'group',
    name: 'Group',
    lastMessage: 'Your runtime has been disconnected...',
    time: '06:09',
    unreadMessages: 6969,
    senderName: 'User',
  },
  {
    id: '4',
    type: 'personal',
    name: 'Jatin',
    lastMessage: 'Pritam Sir ko dekha h??',
    time: '13:10',
    unreadMessages: 0,
    senderName: '',
  },
  {
    id: '5',
    type: 'group',
    name: 'FRIENDS',
    lastMessage: 'Pritam Sir ko dekha h??',
    time: '13:10',
    unreadMessages: 0,
    senderName: 'Jatin',
  },
];

const AllChats = () => {
  return (
    <SafeAreaView>
      <FlatList
        data={chatData}
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

// Export chatData to be used in other components
export { chatData };
export default AllChats;