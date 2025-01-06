import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import LoginModal from './components/LoginModal';

export default function Home() {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    router.replace('/information');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => setIsLoginModalVisible(true)}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Bienvenue</Text>
        <Text style={styles.subtitle}>Dans votre application</Text>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStart}
        >
          <Text style={styles.startButtonText}>Commencer</Text>
        </TouchableOpacity>
        <Text style={styles.policyText}>
          En continuant, vous acceptez notre politique de confidentialité
        </Text>
      </View>

      <LoginModal 
        visible={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  loginButtonText: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  startButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  policyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    paddingHorizontal: 20,
  },
});