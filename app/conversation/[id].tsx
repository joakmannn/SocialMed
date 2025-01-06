import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  StyleSheet,
  Image 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Message } from '../types/database.types';
import { getMessages, sendMessage, markMessagesAsRead, subscribeToMessages } from '../utils/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function ConversationScreen() {
  const { id: otherUserId } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otherUser, setOtherUser] = useState<{ username: string; avatar_url?: string } | null>(null);

  const loadMessages = async () => {
    try {
      const { messages: data, user } = await getMessages(otherUserId as string);
      setMessages(data);
      setOtherUser(user);
      await markMessagesAsRead(otherUserId as string);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  useEffect(() => {
    loadMessages();
    
    let subscription: { unsubscribe: () => void } | undefined;
    
    const setupSubscription = async () => {
      subscription = await subscribeToMessages((payload) => {
        if (payload.sender_id === otherUserId) {
          setMessages(prev => [payload, ...prev]);
          markMessagesAsRead(otherUserId as string);
        }
      });
    };

    setupSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [otherUserId]);

  const handleSend = async () => {
    if (!newMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const sent = await sendMessage(otherUserId as string, newMessage.trim());
      setMessages(prev => [sent, ...prev]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isReceived = item.sender_id === otherUserId;
    const isUnread = isReceived && !item.read_at;

    return (
      <View
        style={[
          styles.messageContainer,
          isReceived ? styles.receivedMessage : styles.sentMessage
        ]}>
        {isReceived ? (
          <TouchableOpacity 
            style={[
              styles.messageContent,
              isUnread ? styles.unreadMessage : styles.receivedMessage
            ]}
            onPress={() => {
              if (isUnread) {
                markMessagesAsRead(otherUserId as string);
                loadMessages();  // Recharger les messages après marquage
              }
            }}
            disabled={!isUnread}
          >
            <Text style={[
              styles.messageText,
              isUnread ? styles.unreadMessageText : styles.receivedMessageText
            ]}>
              {isUnread ? "Appuyez pour lire le message" : item.content}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.messageText}>
            {item.content}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#8A2BE2" />
        </TouchableOpacity>

        {otherUser?.avatar_url ? (
          <Image 
            source={{ uri: otherUser.avatar_url }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.defaultAvatar}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
        )}
        <Text style={styles.username}>{otherUser?.username || 'Utilisateur'}</Text>
      </View>

      <View style={styles.timeLine} />
      
      <FlatList
        data={messages}
        inverted
        keyExtractor={item => item.id}
        renderItem={renderMessage}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Écrivez un message..."
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!newMessage.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageContainer: {
    margin: 8,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#8A2BE2',
    marginLeft: 'auto',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    marginRight: 'auto',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  receivedMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 10,
    marginRight: 5,
  },
  messageContent: {
    width: '100%',
  },
  unreadMessage: {
    backgroundColor: '#8A2BE2',
    opacity: 0.9,
  },
  unreadMessageText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeLine: {
    position: 'absolute',
    left: '50%',
    width: 2,
    height: '100%',
    backgroundColor: '#eee',
    zIndex: -1,
  },
  timeMarker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8A2BE2',
    position: 'absolute',
    left: '50%',
    marginLeft: -5,
  }
}); 