export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          age: number | null;
          gender: 'male' | 'female' | 'unspecified' | null;
          created_at: string;
          updated_at: string;
        };
      };
      private_messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at: string;
          read_at: string | null;
        };
      };
    };
    Views: {
      user_conversations: {
        Row: {
          conversation_id: string;
          other_user_id: string;
          last_message: string;
          last_message_time: string;
          read_at: string | null;
        };
      };
    };
  };
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  sender?: {
    username: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  conversation_id: string;
  other_user_id: string;
  other_username: string;
  last_message: string;
  last_message_time: string;
  read_at: string | null;
  avatar_url?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  age?: number;
  gender?: 'male' | 'female' | 'unspecified';
  created_at: string;
  updated_at: string;
}

// Export vide par défaut pour satisfaire le linter
export default {}; 