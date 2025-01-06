import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasUsername, setHasUsername] = useState(false);

  useEffect(() => {
    checkUsername();
  }, []);

  const checkUsername = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      setHasUsername(!!username);
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="login" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="information" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="age" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="gender" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="signup" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="profile" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
