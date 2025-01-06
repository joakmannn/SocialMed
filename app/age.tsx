import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AgeScreen() {
  const [age, setAge] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (age.trim() && !isNaN(Number(age))) {
      try {
        await AsyncStorage.setItem('userAge', age.trim());
        router.replace('/gender');
      } catch (error) {
        console.error('Error saving age:', error);
      }
    }
  };

  const handleAgeChange = (text: string) => {
    // N'accepte que les nombres
    if (/^\d*$/.test(text)) {
      setAge(text);
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
            <Text style={styles.title}>Quel âge avez-vous ?</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={handleAgeChange}
              placeholder="Votre âge"
              keyboardType="number-pad"
              maxLength={3}
              autoFocus
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, (!age.trim() || isNaN(Number(age))) && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!age.trim() || isNaN(Number(age))}
          >
            <Text style={styles.buttonText}>Continuer</Text>
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
    backgroundColor: '#f8f8f8',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#8A2BE2',
    padding: 18,
    borderRadius: 16,
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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