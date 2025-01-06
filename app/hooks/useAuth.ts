import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../utils/supabase';

WebBrowser.maybeCompleteAuthSession();

// Remplacer avec vos identifiants Google
const GOOGLE_CLIENT_ID = 'VOTRE_CLIENT_ID';
const GOOGLE_ANDROID_CLIENT_ID = 'VOTRE_ANDROID_CLIENT_ID';
const GOOGLE_IOS_CLIENT_ID = 'VOTRE_IOS_CLIENT_ID';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: 'socialmed'
    }),
    scopes: ['profile', 'email'],
    responseType: "id_token",
    extraParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  });

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      signInWithGoogle(authentication?.accessToken);
    }
  }, [response]);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          id: user.id,
          email: user.email!,
          name: user.user_metadata.name,
          avatar_url: user.user_metadata.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle(accessToken: string | undefined) {
    try {
      if (!accessToken) return;

      setLoading(true);
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: accessToken,
      });

      if (error) throw error;

      if (data.user) {
        // Créer ou mettre à jour l'utilisateur dans notre base de données
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata.name,
            avatar_url: data.user.user_metadata.avatar_url,
            updated_at: new Date(),
          })
          .select()
          .single();

        if (upsertError) throw upsertError;

        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.name,
          avatar_url: data.user.user_metadata.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    loading,
    signIn: promptAsync,
    signOut,
  };
}

export default useAuth; 