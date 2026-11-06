import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { CrushyButton } from '../components/CrushyButton';
import { CrushyScreen } from '../components/CrushyScreen';
import { CrushyMascot } from '../components/CrushyMascot';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';
import { useReducedMotion } from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();
  const { palette } = useCrushyTheme();
  const reduceMotion = useReducedMotion();

  return (
    <CrushyScreen scroll={false}>
      <View style={styles.container}>
        <Text style={[styles.brand, { color: palette.text }]}>CRUSHY</Text>
        <View style={[styles.mascotCard, { backgroundColor: palette.lavender }]}>
          <CrushyMascot reduceMotion={reduceMotion} />
        </View>
        <Text style={[styles.title, { color: palette.text }]}>Une bulle rien qu’à toi.</Text>
        <Text style={[styles.copy, { color: palette.subtle }]}>
          Des petits jeux, des surprises et des instants qui mettent de bonne humeur.
        </Text>
        <CrushyButton onPress={() => router.push('/onboarding')}>Découvrir CRUSHY</CrushyButton>
      </View>
    </CrushyScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingBottom: 30 },
  brand: { fontSize: 15, letterSpacing: 2, textAlign: 'center', fontFamily: designTokens.typography.extraBold, marginBottom: 34 },
  mascotCard: { height: 240, borderRadius: designTokens.radius.xl, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, textAlign: 'center', fontFamily: designTokens.typography.extraBold, marginTop: 32 },
  copy: { fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 9, marginBottom: 12, paddingHorizontal: 10 },
});
