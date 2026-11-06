import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useCrushyStore } from '../store/useCrushyStore';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';

export default function SplashScreen() {
  const router = useRouter();
  const hasHydrated = useCrushyStore((state) => state.hasHydrated);
  const onboardingComplete = useCrushyStore((state) => state.onboardingComplete);
  const { palette } = useCrushyTheme();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!hasHydrated) return;
    const timer = setTimeout(() => {
      router.replace(onboardingComplete ? '/(tabs)' : '/welcome');
    }, reducedMotion ? 0 : 650);
    return () => clearTimeout(timer);
  }, [hasHydrated, onboardingComplete, reducedMotion, router]);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <Animated.View entering={reducedMotion ? undefined : FadeIn.duration(220)} style={styles.brand}>
        <View style={[styles.mark, { backgroundColor: palette.pink }]}>
          <Text style={[styles.heart, { color: palette.text }]}>♥</Text>
        </View>
        <Text style={[styles.title, { color: palette.text }]}>CRUSHY</Text>
        <Text style={[styles.subtitle, { color: palette.subtle }]}>L’ennui n’a aucune chance avec toi.</Text>
      </Animated.View>
      {!hasHydrated ? <ActivityIndicator color={palette.accent} style={styles.loading} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 },
  brand: { alignItems: 'center' },
  mark: { width: 70, height: 70, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  heart: { fontSize: 32 },
  title: { fontSize: 28, letterSpacing: 3, fontFamily: designTokens.typography.extraBold },
  subtitle: { fontSize: 14, marginTop: 8, fontFamily: designTokens.typography.regular },
  loading: { position: 'absolute', bottom: 54 },
});
