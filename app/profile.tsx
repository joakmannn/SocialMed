import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface UserInfo {
  username: string;
  age: string;
  gender: string;
}

export default function ProfileScreen() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const age = await AsyncStorage.getItem('userAge');
      const gender = await AsyncStorage.getItem('userGender');
      
      setUserInfo({
        username: username || '',
        age: age || '',
        gender: gender || '',
      });
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'Homme';
      case 'female':
        return 'Femme';
      case 'unspecified':
        return 'Non spécifié';
      default:
        return gender;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={28} color="#000" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.profileTopSection}>
            <View style={styles.profileIconContainer}>
              <View style={styles.profileIcon}>
                <Ionicons name="person-circle" size={80} color="#8A2BE2" />
              </View>
              <TouchableOpacity 
                style={styles.editPhotoButton}
                onPress={() => {
                  // TODO: Implémenter la modification de la photo
                }}
              >
                <Ionicons name="pencil" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            {userInfo && (
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{userInfo.username}</Text>
                <View style={styles.verificationContainer}>
                  <Ionicons name="close-circle-outline" size={20} color="#666" />
                  <Text style={styles.verificationText}>Non vérifié</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.socialNetworksSection}>
            <Text style={styles.sectionTitle}>Mes réseaux</Text>
            <TouchableOpacity style={styles.addSocialButton}>
              <Ionicons name="add-circle-outline" size={24} color="#8A2BE2" />
              <Text style={styles.addSocialText}>Ajouter un réseau social</Text>
            </TouchableOpacity>
          </View>
        </View>

        {userInfo && (
          <>
            <View style={styles.infoContainer}>
              <InfoItem label="Âge" value={userInfo.age} />
              <InfoItem label="Genre" value={getGenderLabel(userInfo.gender)} />
            </View>

            <View style={styles.verificationSection}>
              <Text style={styles.verificationTitle}>Vérifier votre profil</Text>
              <TouchableOpacity style={styles.verificationButton}>
                <View style={styles.verificationButtonContent}>
                  <Ionicons name="mail-outline" size={24} color="#8A2BE2" />
                  <View style={styles.verificationButtonText}>
                    <Text style={styles.verificationButtonTitle}>Email</Text>
                    <Text style={styles.verificationButtonSubtitle}>Ajouter votre email</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#8A2BE2" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.verificationButton}>
                <View style={styles.verificationButtonContent}>
                  <Ionicons name="call-outline" size={24} color="#8A2BE2" />
                  <View style={styles.verificationButtonText}>
                    <Text style={styles.verificationButtonTitle}>Téléphone</Text>
                    <Text style={styles.verificationButtonSubtitle}>Ajouter votre numéro</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#8A2BE2" />
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 15,
    zIndex: 1,
    padding: 10,
  },
  content: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 30,
  },
  profileHeader: {
    marginBottom: 30,
    paddingRight: 20,
  },
  profileTopSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10,
  },
  profileIconContainer: {
    position: 'relative',
    marginRight: 25,
  },
  profileIcon: {
    alignItems: 'center',
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8A2BE2',
    padding: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  socialNetworksSection: {
    marginTop: 10,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  addSocialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  addSocialText: {
    marginLeft: 10,
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: '500',
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  verificationText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    gap: 20,
    marginBottom: 20,
  },
  verificationSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    gap: 15,
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  verificationButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  verificationButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationButtonText: {
    flex: 1,
    marginLeft: 15,
  },
  verificationButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  verificationButtonSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
}); 