import { useRouter } from 'expo-router';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { CrushyButton } from '../components/CrushyButton';
import { CrushyScreen } from '../components/CrushyScreen';
import { CrushyMascot } from '../components/CrushyMascot';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';
import { useReducedMotion } from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();
  const { palette, isDark } = useCrushyTheme();
  const reduceMotion = useReducedMotion();
  const { height } = useWindowDimensions();
  const bottomPadding = Math.min(176, height * 0.21);

  return (
    <CrushyScreen scroll={height < 740}>
      <View style={[styles.container, { paddingBottom: bottomPadding }]}>
        <View style={styles.intro}>
          <Text style={[styles.brand, { color: palette.text }]}>CRUSHY</Text>
          <View style={styles.mascotFrame}>
            {!isDark ? <View style={[styles.mascotShadow, { backgroundColor: palette.shadow }]} /> : null}
            <View style={[styles.mascotCard, { backgroundColor: palette.lavender, borderColor: palette.ink }]}>
              <CrushyMascot reduceMotion={reduceMotion} expression="heureuse" size={220} />
            </View>
          </View>
          <Text style={[styles.title, { color: palette.text }]}>Bienvenue sur Crushy</Text>
          <Text style={[styles.copy, { color: palette.subtle }]}>
            Ta petite bulle de bonne humeur,{'\n'}rien que pour toi.
          </Text>
        </View>
        <View style={styles.actions}>
          <CrushyButton onPress={() => router.push('/onboarding')}>Commencer</CrushyButton>
          <Text style={[styles.privacy, { color: palette.subtle }]}>On ne garde que ce qui te fait du bien.</Text>
        </View>
      </View>
    </CrushyScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingBottom: 176 },
  intro: { alignItems: 'stretch' },
  brand: { fontSize: 16, letterSpacing: 3, textAlign: 'center', fontFamily: designTokens.typography.extraBold, marginBottom: 27 },
  mascotFrame: { position: 'relative', marginBottom: 27 },
  mascotShadow: {
    position: 'absolute',
    top: designTokens.chunky.depth,
    left: 0,
    right: 0,
    bottom: -designTokens.chunky.depth,
    borderRadius: designTokens.radius.xl,
  },
  mascotCard: {
    height: 250,
    borderRadius: designTokens.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: designTokens.chunky.outline,
  },
  title: { fontSize: 24, textAlign: 'center', fontFamily: designTokens.typography.extraBold, marginTop: 1 },
  copy: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 2, paddingHorizontal: 10 },
  actions: { gap: 44 },
  privacy: { fontSize: 11, textAlign: 'center' },
});
