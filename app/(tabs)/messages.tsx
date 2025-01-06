import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import ConversationItem from '../components/ConversationItem';
import { supabase } from '../utils/supabase';

interface Conversation {
  id: string;
  last_message: string;
  last_message_at: string;
  last_message_user_id: string;
  participants: {
    user_id: string;
    user_name: string;
    user_avatar: string;
  }[];
}

export default function MessagesScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchConversations();

    // Souscrire aux mises à jour des messages
    const channel = supabase
      .channel('messages_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          // Recharger les conversations pour avoir les derniers messages
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConversations = async () => {
    try {
      console.log('Fetching conversations...');
      
      // Récupérer les conversations où l'utilisateur est participant
      const { data: userConversations, error: conversationsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', '1');

      if (conversationsError) throw conversationsError;

      const conversationIds = userConversations.map(c => c.conversation_id);

      // Récupérer les détails des conversations avec leur dernier message
      const { data: conversations, error: detailsError } = await supabase
        .from('conversations')
        .select(`
          id,
          conversation_participants (
            user_id,
            user_name,
            user_avatar
          )
        `)
        .in('id', conversationIds);

      if (detailsError) throw detailsError;

      // Récupérer le dernier message pour chaque conversation
      const conversationsWithMessages = await Promise.all(
        conversations.map(async (conv) => {
          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            id: conv.id,
            last_message: messages?.text || '',
            last_message_at: messages?.created_at || new Date().toISOString(),
            last_message_user_id: messages?.user_id || '',
            participants: conv.conversation_participants || [],
          };
        })
      );

      // Trier les conversations par date du dernier message
      const sortedConversations = conversationsWithMessages.sort((a, b) => 
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );

      setConversations(sortedConversations);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationPress = (conversationId: string) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: conversationId }
    });
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    // Trouver l'autre participant
    const otherParticipant = item.participants.find(p => p.user_id !== '1');

    if (!otherParticipant) return null;

    // Formater la date du dernier message
    const messageDate = new Date(item.last_message_at);
    const now = new Date();
    let formattedTime: string;

    if (messageDate.toDateString() === now.toDateString()) {
      // Si c'est aujourd'hui, afficher l'heure
      formattedTime = messageDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (messageDate.getTime() > now.getTime() - 24 * 60 * 60 * 1000) {
      // Si c'est hier
      formattedTime = 'Hier';
    } else {
      // Sinon afficher la date
      formattedTime = messageDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
    }

    // Formater le dernier message
    const isOwnMessage = item.last_message_user_id === '1';
    const lastMessage = isOwnMessage ? `Vous : ${item.last_message}` : item.last_message;

    return (
      <ConversationItem
        name={otherParticipant.user_name}
        lastMessage={lastMessage}
        time={formattedTime}
        unread={false}
        avatar={otherParticipant.user_avatar}
        onPress={() => handleConversationPress(item.id)}
      />
    );
  };

  const ItemSeparator = () => <View style={styles.separator} />;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 80,
  },
}); 