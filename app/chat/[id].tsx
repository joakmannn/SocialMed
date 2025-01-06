import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabase';

// Types pour Supabase
interface ChatMessage {
  id: string;
  conversation_id: string;
  text: string;
  created_at: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
}

interface Participant {
  user_id: string;
  user_name: string;
  user_avatar: string;
}

export default function IndividualChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Charger les participants de la conversation
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { data, error } = await supabase
          .from('conversation_participants')
          .select('user_id, user_name, user_avatar')
          .eq('conversation_id', id);

        if (error) throw error;
        if (data) setParticipants(data);
      } catch (error) {
        console.error('Erreur lors du chargement des participants:', error);
      }
    };

    fetchParticipants();
  }, [id]);

  // Charger et souscrire aux messages
  useEffect(() => {
    fetchMessages();
    
    // Souscrire aux nouveaux messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${id}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          const giftedMessage: IMessage = {
            _id: newMessage.id,
            text: newMessage.text,
            createdAt: new Date(newMessage.created_at),
            user: {
              _id: newMessage.user_id,
              name: newMessage.user_name,
              avatar: newMessage.user_avatar,
            },
          };
          setMessages(previousMessages => GiftedChat.append(previousMessages, [giftedMessage]));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages for conversation:', id);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      console.log('Fetched messages:', data);

      if (!data) {
        setMessages([]);
        return;
      }

      const formattedMessages: IMessage[] = data.map((msg: ChatMessage) => ({
        _id: msg.id,
        text: msg.text,
        createdAt: new Date(msg.created_at),
        user: {
          _id: msg.user_id,
          name: msg.user_name,
          avatar: msg.user_avatar,
        },
      }));

      console.log('Formatted messages:', formattedMessages);
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    try {
      const message = newMessages[0];
      console.log('Sending message:', message);
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: id,
          text: message.text,
          user_id: message.user._id,
          user_name: message.user.name || 'Utilisateur',
          user_avatar: message.user.avatar || '',
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      console.log('Message sent successfully:', data);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  // Trouver le nom de l'autre participant pour l'afficher dans l'en-tête
  const otherParticipant = participants.find(p => p.user_id !== '1');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{otherParticipant?.user_name || 'Chat'}</Text>
        </View>
      </View>
      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: '1',
            name: 'Moi',
          }}
          placeholder="Écrivez votre message..."
          locale="fr"
          renderAvatar={null}
          alwaysShowSend
          scrollToBottom
          renderUsernameOnMessage
          showUserAvatar={false}
          showAvatarForEveryMessage={false}
          timeFormat="HH:mm"
          dateFormat="DD/MM/YYYY"
          maxInputLength={1000}
          listViewProps={{
            style: styles.listView,
          }}
          inverted={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listView: {
    backgroundColor: '#f5f5f5',
  },
}); 