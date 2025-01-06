import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const LoginButton = ({ text, color }: { text: string; color: string }) => (
    <TouchableOpacity 
      style={[styles.loginButton, { backgroundColor: color }]}
      onPress={() => {
        // TODO: Implémenter la logique de connexion
        router.replace('/(tabs)');
      }}
    >
      <Text style={styles.loginButtonText}>Continuer avec {text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Se connecter</Text>
          <Text style={styles.subtitle}>
            Choisissez une méthode pour vous connecter
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <LoginButton 
            text="Google"
            color="#4285F4"
          />
          <LoginButton 
            text="Apple"
            color="#000000"
          />
          <LoginButton 
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
  loginButton: {
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
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 