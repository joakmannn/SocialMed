import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import supabase from './utils/supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InformationScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Signing up with data:', { username });

      const { data, error } = await supabase.auth.signUp({
        email: `${username}@user.id`,
        password,
        options: {
          data: {
            username,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      });

      console.log('Sign up response:', { data, error });

      if (error) throw error;
      if (!data.user) throw new Error('No user data');

      // Vérifier que l'utilisateur est bien créé
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);

      await Promise.all([
        AsyncStorage.setItem('username', username),
        AsyncStorage.setItem('userId', data.user.id),
        session && AsyncStorage.setItem('session', JSON.stringify(session))
      ]);

      router.push('/age');
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert(
        'Erreur',
        error.message === 'Password should be at least 6 characters.'
          ? 'Le mot de passe doit contenir au moins 6 caractères'
          : 'Une erreur est survenue'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.contentContainer}>
          <View style={styles.topContent}>
            <Text style={styles.title}>Créez votre compte</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Choisissez un identifiant"
              autoFocus
              maxLength={30}
              autoCapitalize="none"
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Choisissez un mot de passe"
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.button, 
              (!username.trim() || !password.trim() || isLoading) && styles.buttonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!username.trim() || !password.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Continuer</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  topContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
  },
  button: {
    backgroundColor: '#8A2BE2',
    padding: 18,
    borderRadius: 16,
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
    marginHorizontal: 20,
  },
  buttonDisabled: {
    backgroundColor: '#B794F5',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 