import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import UserOptionsModal from '../components/UserOptionsModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../utils/supabaseConfig';

const HeaderRight = () => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <TouchableOpacity 
        onPress={() => setIsModalVisible(true)}
        style={{ marginRight: 15 }}
      >
        <Ionicons name="person-circle-outline" size={28} color="#8A2BE2" />
      </TouchableOpacity>

      <UserOptionsModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onProfilePress={() => router.push('../profile')}
        onLogoutPress={handleLogout}
      />
    </>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('private_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .is('read_at', null);

      setUnreadCount(count || 0);
    };

    loadUnreadCount();

    // S'abonner aux nouveaux messages
    const subscription = supabase
      .channel('unread_count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'private_messages',
          filter: 'read_at=is.null'
        },
        () => {
          loadUnreadCount();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const commonScreenOptions = {
    headerRight: () => <HeaderRight />,
    headerStyle: {
      backgroundColor: colorScheme === 'dark' ? '#353636' : '#ffffff',
    },
    headerShadowVisible: false,
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8A2BE2',
        tabBarInactiveTintColor: '#808080',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colorScheme === 'dark' ? '#353636' : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#454545' : '#e0e0e0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        ...commonScreenOptions,
      }}>
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          headerTitle: '',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorer',
          headerTitle: '',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          headerTitle: '',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
    </Tabs>
  );
}
