import Nunito_400Regular from '@expo-google-fonts/nunito/400Regular/Nunito_400Regular.ttf';
import Nunito_700Bold from '@expo-google-fonts/nunito/700Bold/Nunito_700Bold.ttf';
import Nunito_800ExtraBold from '@expo-google-fonts/nunito/800ExtraBold/Nunito_800ExtraBold.ttf';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CrushyAchievementCelebration } from '../components/CrushyAchievementCelebration';
import { CrushyAudioProvider } from '../components/CrushyAudioProvider';
import { CrushyConnectivityBanner } from '../components/CrushyConnectivityBanner';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';
import { useReducedMotion } from 'react-native-reanimated';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font, Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold });
  const { palette, isDark } = useCrushyTheme();
  const reduceMotion = useReducedMotion();

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <CrushyAudioProvider>
        <View style={[styles.root, { backgroundColor: palette.background }]}>
          <CrushyConnectivityBanner />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: palette.background },
              headerTintColor: palette.text,
              headerTitleStyle: { fontFamily: designTokens.typography.bold },
              contentStyle: { backgroundColor: palette.background },
              animation: reduceMotion ? 'none' : 'default',
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="daily" options={{ title: 'Humeur du jour' }} />
            <Stack.Screen name="rewards" options={{ title: 'Mes récompenses' }} />
            <Stack.Screen name="settings" options={{ title: 'Réglages' }} />
            <Stack.Screen name="game/[slug]" options={{ title: 'Mini-jeu' }} />
          </Stack>
          <CrushyAchievementCelebration />
        </View>
      </CrushyAudioProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
