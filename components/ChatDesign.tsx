import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface ChatDesignProps {
  type: 'personal' | 'group';
  name: string;
  lastMessage: string;
  time: string;
  unreadMessages: number;
  senderName: string;
  profileImageUrl?: string; // Add profileImageUrl prop
  onPress?: () => void; // Add onPress prop for navigation
}

const ChatDesign: React.FC<ChatDesignProps> = ({
  type,
  name,
  lastMessage,
  time,
  unreadMessages,
  senderName,
  profileImageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatar}>
        {profileImageUrl ? (
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.profileImage}
          />
        ) : (
          <Text style={styles.avatarText}>
            {name[0].toUpperCase()} {/* Display the first letter of the name */}
          </Text>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>
          {type === 'personal' ? name : `${name} (Group)`} {/* Show group tag for group chats */}
        </Text>
        <Text style={styles.lastMessage}>
          {senderName && `${senderName}: `} {/* Show sender name if available */}
          {lastMessage}
        </Text>
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
    alignItems: 'center',
    backgroundColor: '#1C1C28', // Dark background for better contrast
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF', // Blue background for avatar
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  lastMessage: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  meta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
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
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ChatDesign;