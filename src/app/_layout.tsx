import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthContextProvider, useAuth } from '../context/authContext';

import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useEffect } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();
  const segements = useSegments();
  const router = useRouter();

  useEffect(() => {
    // check if user is authenticated
    if (!isAuthenticated) return;
    const inApp = segements[0] == '(tabs)';
    if (isAuthenticated && !inApp) {
      router.replace('/signIn');
    } else if (!isAuthenticated) {
      router.replace('/signIn')
    }

  },[isAuthenticated])
  return(
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="signIn" options={{ headerShown: false }} />
          <Stack.Screen name="signUp" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
}
