import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list';
import supabase from './utils/supabase';

type Gender = 'male' | 'female' | 'unspecified';

const genderOptions = [
  { key: 'male', value: 'Homme' },
  { key: 'female', value: 'Femme' },
  { key: 'unspecified', value: 'Non spécifié' },
];

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender>('unspecified');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await supabase.updateUserProfile({ gender: selectedGender });
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le genre');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.topContent}>
          <Text style={styles.title}>Sélectionnez votre genre</Text>
          
          <View style={styles.selectContainer}>
            <SelectList
              setSelected={(val: Gender) => setSelectedGender(val)}
              data={genderOptions}
              save="key"
              defaultOption={{ key: 'unspecified', value: 'Non spécifié' }}
              search={false}
              boxStyles={styles.selectBox}
              dropdownStyles={styles.dropdown}
              inputStyles={styles.selectInput}
              dropdownTextStyles={styles.dropdownText}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginBottom: 40,
    textAlign: 'center',
  },
  selectContainer: {
    marginHorizontal: 20,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    padding: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  selectInput: {
    fontSize: 16,
    color: '#000',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
}); 