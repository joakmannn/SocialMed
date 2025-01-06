import supabase from './supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, Conversation } from '../types/database.types';

// Fonctions d'authentification
export const signUp = async (username: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: `${username}@user.id`,
    password,
    options: {
      data: { username }
    }
  });

  if (error) throw error;
  if (!data.user) throw new Error('No user data');

  // Créer le profil utilisateur
  await createUserProfile(username);

  await AsyncStorage.setItem('userId', data.user.id);
  await AsyncStorage.setItem('username', username);

  return data.user;
};

export const signIn = async (username: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${username}@user.id`,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('No user data');

  await AsyncStorage.setItem('userId', data.user.id);
  await AsyncStorage.setItem('username', username);

  return data.user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  await AsyncStorage.clear();
};

// Fonctions de gestion des messages
export const getMessages = async (otherUserId: string) => {
  // Récupérer l'utilisateur actuel d'abord
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  // Récupérer les infos de l'autre utilisateur
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('username, avatar_url')
    .eq('id', otherUserId)
    .single();

  if (userError) throw userError;

  // Récupérer les messages
  const { data: messages, error: messagesError } = await supabase
    .from('private_messages')
    .select('*')
    .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
    .order('created_at', { ascending: false });

  if (messagesError) throw messagesError;

  // Masquer le contenu des messages non lus
  const processedMessages = messages.map(msg => ({
    ...msg,
    content: (!msg.read_at && msg.receiver_id === user.id)
      ? "Appuyez pour lire le message"
      : msg.content
  }));

  return {
    messages: processedMessages as Message[],
    user: userData
  };
};

export const sendMessage = async (receiverId: string, content: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { data, error } = await supabase
    .from('private_messages')
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  return data as Message;
};

export const getConversations = async () => {
  try {
    const { data, error } = await supabase
      .from('user_conversations')
      .select('*');

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    return data as Conversation[];
  } catch (error) {
    console.error('Error in getConversations:', error);
    throw error;
  }
};

export const markMessagesAsRead = async (senderId: string) => {
  const { error } = await supabase
    .from('private_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('sender_id', senderId)
    .is('read_at', null);

  if (error) throw error;
};

// Mise à jour des métadonnées utilisateur
export const updateUserProfile = async (data: {
  age?: number;
  gender?: 'male' | 'female' | 'unspecified';
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { error } = await supabase
    .from('users')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (error) throw error;
};

// Création du profil lors de l'inscription
export const createUserProfile = async (username: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { error } = await supabase
    .from('users')
    .insert({
      id: user.id,
      username,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
};

// Récupérer le profil d'un utilisateur
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

// Abonnement aux messages en temps réel
export const subscribeToMessages = async (callback: (message: Message) => void) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  return supabase
    .channel(`private_messages:${user.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'private_messages',
        filter: `receiver_id=eq.${user.id}`
      },
      (payload) => {
        const message = payload.new as Message;
        if (message.receiver_id === user.id) {
          callback(message);
        }
      }
    )
    .subscribe();
};

// Export par défaut des fonctions utilitaires
export default {
  signUp,
  signIn,
  signOut,
  updateUserProfile,
  createUserProfile,
  getUserProfile,
  getMessages,
  sendMessage,
  getConversations,
  markMessagesAsRead,
  subscribeToMessages
}; 