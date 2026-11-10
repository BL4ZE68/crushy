import Nunito_400Regular from '@expo-google-fonts/nunito/400Regular/Nunito_400Regular.ttf';
import Nunito_700Bold from '@expo-google-fonts/nunito/700Bold/Nunito_700Bold.ttf';
import Nunito_800ExtraBold from '@expo-google-fonts/nunito/800ExtraBold/Nunito_800ExtraBold.ttf';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useCrushyTheme } from '../../src/theme/useCrushyTheme';

export default function AdminLayout() {
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold });
  const { palette, isDark } = useCrushyTheme();

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[styles.root, { backgroundColor: palette.background }]}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.background },
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
