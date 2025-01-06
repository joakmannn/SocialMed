import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://elnywwwzqzxytzqmjdsi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbnl3d3d6cXp4eXR6cW1qZHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNTg5MTAsImV4cCI6MjA1MTczNDkxMH0.UB30jK9E2KKhDmT9IiAoMxOd3jV_iNlcEtekJyQVDBs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 