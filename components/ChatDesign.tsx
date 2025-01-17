import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ChatDesignProps {
  type: 'personal' | 'group';
  name: string;
  lastMessage: string;
  time: string;
  unreadMessages: number;
  senderName: string;
}

const ChatDesign: React.FC<ChatDesignProps> = ({
  type,
  name,
  lastMessage,
  time,
  unreadMessages,
  senderName,
}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.avatar}>
        {/* Add avatar logic here */}
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>
          {type === 'personal' ? `Chat with ${name}` : name}
        </Text>
        <Text style={styles.lastMessage}>{lastMessage}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.time}>{time}</Text>
        {unreadMessages > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadMessages}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: '#0A4B6C',
    height: 75,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  lastMessage: {
    fontSize: 14,
    color: '#ccc',
  },
  meta: {
    alignItems: 'flex-end',
  },
  time: {
    color: '#ccc',
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: '#00A4E0',
    borderRadius: 15,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 5,
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ChatDesign;