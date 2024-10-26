import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

// ChatDesign component
interface ChatDesignProps {
  type: 'personal' | 'group' | 'community';
  name: string;
  lastMessage: string;
  time: string;
  unreadMessages: number;
  senderName: string;
}

const ChatDesign: React.FC<ChatDesignProps> = ({ type, name, lastMessage, time, unreadMessages, senderName }) => {
  // Conditional rendering based on chat type
  const renderChatIcon = () => {
    if (type === 'personal') {
      return <FontAwesome name="user-circle-o" size={30} color="gray" />;
    } else if (type === 'group') {
      return <FontAwesome name="users" size={30} color="gray" />;
    } else if (type === 'community') {
      return <FontAwesome name="users" size={30} color="gray" />;
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.leftSection}>
        {renderChatIcon()}
      </View>
      <View style={styles.middleSection}>
        <Text style={styles.chatName}>
          {name}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {senderName && (
            <Text style={{fontWeight:'bold'}}>{senderName + ': '}</Text>
          )}
          {lastMessage}
        </Text>
      </View>
      <View style={styles.rightSection}>
        {type != 'community' && (
          <Text style={styles.time}>{time}</Text>
        )}
        {type == 'community' && (
          <Ionicons name="chevron-forward" size={24} color="#D9D9D9" />
        )}
        {unreadMessages > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{unreadMessages}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: '#0A4B6C',
    height: 75,
  },
  leftSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  lastMessage: {
    color: '#ccc',
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
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
  unreadCount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ChatDesign;