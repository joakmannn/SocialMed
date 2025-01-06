import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Message } from '../types/database.types';
import supabase from '../utils/supabaseConfig';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Message[]>([]);
  const router = useRouter();

  const loadNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('private_messages')
      .select(`
        *,
        sender:users!sender_id (
          username,
          avatar_url
        )
      `)
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading notifications:', error);
      return;
    }

    setNotifications(data || []);
  };

  useEffect(() => {
    const setupNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      loadNotifications();

      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'private_messages',
            filter: `receiver_id=eq.${user.id}`
          },
          (payload) => {
            const newMessage = payload.new as Message;
            if (newMessage.receiver_id === user.id) {
              setNotifications(prev => [
                {
                  ...newMessage,
                  sender: {
                    username: 'Nouveau message',
                    avatar_url: undefined
                  }
                } as Message,
                ...prev
              ]);
              loadNotifications();
            }
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    };

    setupNotifications();

    const interval = setInterval(loadNotifications, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleNotificationPress = async (notification: Message) => {
    // Marquer comme lu
    await supabase
      .from('private_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notification.id);

    // Aller à la conversation
    router.push(`/conversation/${notification.sender_id}`);
  };

  const renderNotification = ({ item }: { item: Message }) => {
    const senderName = item.sender?.username || 'Utilisateur';
    const formattedTime = (() => {
      const messageDate = new Date(item.created_at);
      const now = new Date();
      const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return messageDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } else if (diffInHours < 48) {
        return 'Hier';
      } else {
        return messageDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short'
        });
      }
    })();

    const isUnread = !item.read_at;

    return (
      <TouchableOpacity 
        style={[
          styles.notificationItem,
          !isUnread && styles.readNotification
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.avatarContainer}>
          {item.sender?.avatar_url ? (
            <Image 
              source={{ uri: item.sender.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={[
              styles.defaultAvatar,
              !isUnread && styles.readDefaultAvatar
            ]}>
              <Text style={styles.avatarText}>
                {senderName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <View style={styles.senderContainer}>
              <Text style={[
                styles.sender,
                !isUnread && styles.readSender
              ]}>
                {senderName}
              </Text>
              <Text style={styles.notificationText}>
                vous a envoyé un message
              </Text>
            </View>
            <Text style={styles.time}>{formattedTime}</Text>
          </View>
          {isUnread && (
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Nouveau</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Pas de nouvelles notifications</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  defaultAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  senderContainer: {
    flex: 1,
    marginRight: 8,
  },
  sender: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  badge: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  avatarText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  readNotification: {
    backgroundColor: '#fafafa',
  },
  readDefaultAvatar: {
    backgroundColor: '#b794f4',
  },
  readSender: {
    fontWeight: 'normal',
  },
}); 