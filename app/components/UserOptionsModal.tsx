import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onProfilePress: () => void;
  onLogoutPress: () => void;
}

export default function UserOptionsModal({ 
  visible, 
  onClose, 
  onProfilePress,
  onLogoutPress 
}: UserOptionsModalProps) {
  
  const OptionButton = ({ 
    icon, 
    text, 
    onPress, 
    color = '#000' 
  }: { 
    icon: string; 
    text: string; 
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity 
      style={styles.optionButton}
      onPress={() => {
        onPress();
        onClose();
      }}
    >
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.optionText, { color }]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <OptionButton 
            icon="person-outline"
            text="Voir profil"
            onPress={onProfilePress}
          />
          <View style={styles.separator} />
          <OptionButton 
            icon="log-out-outline"
            text="Déconnexion"
            onPress={onLogoutPress}
            color="#FF3B30"
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 60,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
}); 