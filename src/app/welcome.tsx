import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ChunkyCard } from '../components/ChunkySurface';
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
  const bottomPadding = Math.min(140, height * 0.16);

  return (
    <CrushyScreen scroll={height < 740}>
      <View style={[styles.container, { paddingBottom: bottomPadding }]}>
        <View style={styles.intro}>
          {/* Logo marque */}
          <View style={styles.brandRow}>
            <Text style={[styles.brand, { color: palette.text }]}>CRUSHY</Text>
            <View style={[styles.brandPill, { backgroundColor: palette.pink, borderColor: palette.ink }]}>
              <Text style={[styles.brandPillText, { color: palette.ink }]}>JELLY POP</Text>
            </View>
          </View>

          {/* Cadre de la mascotte Pip */}
          <ChunkyCard depth={5} radius={designTokens.radius.xl} tint={palette.lavender} style={styles.mascotFrame}>
            <View style={styles.mascotCard}>
              <CrushyMascot reduceMotion={reduceMotion} expression="heureuse" size={210} interactive />
            </View>
          </ChunkyCard>

          <Text style={[styles.title, { color: palette.text }]}>Bienvenue dans ton cocon</Text>
          <Text style={[styles.copy, { color: palette.subtle }]}>
            Ta bulle de réconfort, de mini-jeux amusants et de pensées douces au quotidien.
          </Text>

          {/* Points forts en pilules */}
          <View style={styles.featuresRow}>
            <View style={[styles.featurePill, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <Ionicons name="sparkles" size={13} color={palette.accent} />
              <Text style={[styles.featureText, { color: palette.text }]}>Mini-jeux légers</Text>
            </View>
            <View style={[styles.featurePill, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <Ionicons name="shield-checkmark" size={13} color="#4CAF50" />
              <Text style={[styles.featureText, { color: palette.text }]}>100% Privé & local</Text>
            </View>
            <View style={[styles.featurePill, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <Ionicons name="heart" size={13} color="#E91E63" />
              <Text style={[styles.featureText, { color: palette.text }]}>Sans pression</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <CrushyButton onPress={() => router.push('/onboarding')}>
            Commencer mon aventure ✨
          </CrushyButton>
          <Text style={[styles.privacy, { color: palette.subtle }]}>
            Garde uniquement ce qui te fait du bien · Aucune inscription requise
          </Text>
        </View>
      </View>
    </CrushyScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  intro: { alignItems: 'center' },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    marginTop: 6,
  },
  brand: {
    fontSize: 20,
    letterSpacing: 3,
    fontFamily: designTokens.typography.extraBold,
  },
  brandPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
  },
  brandPillText: {
    fontSize: 9,
    fontFamily: designTokens.typography.extraBold,
    letterSpacing: 0.8,
  },
  mascotFrame: {
    width: '100%',
    marginBottom: 20,
  },
  mascotCard: {
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    fontFamily: designTokens.typography.extraBold,
    letterSpacing: -0.3,
  },
  copy: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
  },
  featureText: {
    fontSize: 11,
    fontFamily: designTokens.typography.bold,
  },
  actions: {
    gap: 12,
    marginTop: 20,
  },
  privacy: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
