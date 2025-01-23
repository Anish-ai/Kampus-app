import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import { sendMessage, getMessages, subscribeToMessages, Message } from '../../../types/chats';

const ChatScreen = () => {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const { name, profileImageUrl } = useLocalSearchParams<{ name: string; profileImageUrl: string }>(); // Get name and profile image from route params
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      const fetchedMessages = await getMessages(chatId);
      setMessages(fetchedMessages);
    };

    fetchMessages();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToMessages(chatId, (newMessages) => {
      setMessages(newMessages);
    });

    return unsubscribe;
  }, [chatId]);

  const handleSendMessage = async () => {
    if (messageText.trim() && user) {
      await sendMessage(chatId, user.uid, messageText);
      setMessageText('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: profileImageUrl || 'https://via.placeholder.com/150' }} // Use profile image or placeholder
          style={styles.profileImage}
        />
        <Text style={styles.name}>{name || 'User'}</Text>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={item.senderId === user?.uid ? styles.sentMessage : styles.receivedMessage}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    backgroundColor: '#1C1C28',
  },
  backButton: {
    color: '#007AFF',
    fontSize: 16,
    marginRight: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    padding: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    color: '#fff',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;