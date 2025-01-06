import { View, StyleSheet } from 'react-native';
import LoginModal from './components/LoginModal';
import { useState } from 'react';

export default function LoginScreen() {
  const [isModalVisible, setIsModalVisible] = useState(true);

  return (
    <View style={styles.container}>
      <LoginModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 