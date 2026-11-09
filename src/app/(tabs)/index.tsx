import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { CrushyButton } from '../../components/CrushyButton';
import { CrushyScreen } from '../../components/CrushyScreen';
import { CrushyMascot } from '../../components/CrushyMascot';
import { FeatureCard } from '../../components/FeatureCard';
import { moodMeta } from '../../theme/moods';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { useCrushyStore } from '../../store/useCrushyStore';
import { useReducedMotion } from 'react-native-reanimated';

export default function HomeScreen() {
  const router = useRouter();
  const nickname = useCrushyStore((state) => state.nickname);
  const mood = useCrushyStore((state) => state.mood);
  const xp = useCrushyStore((state) => state.xp);
  const { palette, isDark } = useCrushyTheme();
  const reduceMotion = useReducedMotion();
  const heroTint = mood ? moodMeta[mood].tint(palette) : palette.pink;

  return (
    <CrushyScreen>
      <Text style={[styles.eyebrow, { color: palette.accent }]}>TA PETITE BULLE DE BONNE HUMEUR</Text>
      <Text style={[styles.screenTitle, { color: palette.text }]}>{`Coucou ${nickname} !`}</Text>
      <Text style={[styles.screenSubtitle, { color: palette.subtle }]}>
        Prête à transformer une petite pause{'\n'}en bon moment ?
      </Text>
      <View style={styles.heroWrap}>
        {!isDark ? <View style={[styles.heroShadow, { backgroundColor: palette.shadow }]} /> : null}
        <View style={[styles.hero, { backgroundColor: heroTint, borderColor: palette.ink }]}>
          <View style={styles.heroCopy}>
            <Text style={[styles.heroEyebrow, { color: palette.text }]}>TA DOSE DU JOUR</Text>
            <Text style={[styles.heroTitle, { color: palette.text }]}>Un sourire{'\n'}à la fois.</Text>
            <Text style={[styles.heroSmall, { color: palette.text }]}>{xp} XP récoltés tout doucement</Text>
          </View>
          <CrushyMascot reduceMotion={reduceMotion} expression={mood ?? 'neutre'} size={128} />
        </View>
      </View>

      <Text style={[styles.sectionLabel, { color: palette.subtle }]}>TON HUMEUR</Text>
      <PressMoodCard mood={mood} onPress={() => router.push('/daily')} />

      <Text style={[styles.sectionLabel, { color: palette.subtle }]}>À TOI DE CHOISIR</Text>
      <FeatureCard
        title="Une partie rapide ?"
        description="Des mini-jeux pour rire et te surprendre."
        label="ZONE JEUX"
        href="/games"
        tint={palette.surfaceAlt}
        emoji="🎮"
      />
      <FeatureCard
        title="Un petit mot pour toi"
        description="Ouvre une enveloppe et découvre ta surprise."
        label="BOÎTE À SURPRISES"
        href="/surprises"
        tint={palette.surface}
        emoji="🎁"
      />
    </CrushyScreen>
  );
}

function PressMoodCard({ mood, onPress }: { mood: string | null; onPress: () => void }) {
  const { palette } = useCrushyTheme();
  return (
    <View style={[styles.moodCard, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
      <View style={styles.moodText}>
        <Text style={[styles.moodTitle, { color: palette.text }]}>{mood ? `Aujourd’hui : ${mood}` : 'Comment tu te sens ?'}</Text>
        <Text style={[styles.moodSubtitle, { color: palette.subtle }]}>Une petite pensée à ton humeur.</Text>
      </View>
      <CrushyButton secondary onPress={onPress} style={styles.moodButton}>{mood ? 'Changer' : 'Choisir'}</CrushyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 11, lineHeight: 14, letterSpacing: 0.6, fontFamily: designTokens.typography.bold, marginBottom: 6 },
  screenTitle: { fontSize: 26, lineHeight: 31, fontFamily: designTokens.typography.extraBold, letterSpacing: -0.3 },
  screenSubtitle: { fontSize: 14, lineHeight: 19, fontFamily: designTokens.typography.regular, marginTop: 1, marginBottom: 5 },
  sectionLabel: { fontSize: 11, lineHeight: 14, letterSpacing: 0.5, fontFamily: designTokens.typography.bold, marginTop: 21, marginBottom: 10 },
  heroWrap: { marginBottom: 0 },
  heroShadow: {
    position: 'absolute',
    top: designTokens.chunky.depth,
    left: 0,
    right: 0,
    bottom: -designTokens.chunky.depth,
    borderRadius: designTokens.radius.xl,
  },
  hero: {
    borderRadius: designTokens.radius.xl,
    minHeight: 154,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: designTokens.chunky.outline,
  },
  heroCopy: { flex: 1 },
  heroEyebrow: { fontSize: 10, letterSpacing: 1.1, fontFamily: designTokens.typography.bold },
  heroTitle: { fontSize: 28, lineHeight: 31, fontFamily: designTokens.typography.extraBold, marginTop: 7 },
  heroSmall: { fontSize: 12, marginTop: 8, opacity: 0.85 },
  moodCard: {
    borderWidth: designTokens.chunky.outline,
    borderRadius: designTokens.radius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodText: { flex: 1 },
  moodTitle: { fontSize: 14, fontFamily: designTokens.typography.bold, textTransform: 'capitalize' },
  moodSubtitle: { fontSize: 12, marginTop: 3 },
  moodButton: { width: 96, marginTop: 0, minHeight: 42, marginLeft: 10 },
});
