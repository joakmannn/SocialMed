import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const { height } = Dimensions.get('window');

export default function LoginModal({ visible, onClose }: LoginModalProps) {
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);

  const LoginButton = ({ text, color }: { text: string; color: string }) => (
    <TouchableOpacity style={[styles.loginButton, { backgroundColor: color }]}>
      <Text style={styles.loginButtonText}>Continuer avec {text}</Text>
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
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.handle} />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.title}>Se connecter</Text>
          
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
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: -10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '300',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
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
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 