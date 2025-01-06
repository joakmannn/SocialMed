import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = 'https://elnywwwzqzxytzqmjdsi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbnl3d3d6cXp4eXR6cW1qZHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNTg5MTAsImV4cCI6MjA1MTczNDkxMH0.UB30jK9E2KKhDmT9IiAoMxOd3jV_iNlcEtekJyQVDBs';

// Instance Supabase unique pour toute l'application
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase; 