import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ThemeProvider } from './contexts/ThemeContext';

export default function RootLayout() {

  useFonts({
    'outfit' : require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold' : require('./../assets/fonts/Outfit-Bold.ttf'),
    'outfit-medium' : require('./../assets/fonts/Outfit-Medium.ttf')
  })

  return (

    <ThemeProvider>
      <Stack screenOptions={{
        headerShown:false
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="wallet" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
