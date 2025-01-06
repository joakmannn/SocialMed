import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const router = useRouter();
  const { signIn, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erreur lors de la connexion avec Google:', error);
    }
  };

  const SignupButton = ({ 
    text, 
    color, 
    icon, 
    onPress, 
    isLoading 
  }: { 
    text: string; 
    color: string; 
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    isLoading?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.signupButton, { backgroundColor: color }]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <Ionicons name={icon} size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.signupButtonText}>Continuer avec {text}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>S'inscrire</Text>
          <Text style={styles.subtitle}>
            Choisissez une méthode pour créer votre compte
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <SignupButton 
            text="Google"
            color="#4285F4"
            icon="logo-google"
            onPress={handleGoogleSignIn}
            isLoading={loading}
          />
          <SignupButton 
            text="Apple"
            color="#000000"
            icon="logo-apple"
          />
          <SignupButton 
            text="Numéro"
            color="#8A2BE2"
            icon="phone-portrait-outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    gap: 15,
  },
  signupButton: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
}); 