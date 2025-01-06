import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();

  const SignupButton = ({ text, color }: { text: string; color: string }) => (
    <TouchableOpacity 
      style={[styles.signupButton, { backgroundColor: color }]}
      onPress={() => {
        // TODO: Implémenter la logique de connexion
        router.replace('/(tabs)');
      }}
    >
      <Text style={styles.signupButtonText}>Continuer avec {text}</Text>
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
          />
          <SignupButton 
            text="Apple"
            color="#000000"
          />
          <SignupButton 
            text="Numéro"
            color="#8A2BE2"
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
}); 