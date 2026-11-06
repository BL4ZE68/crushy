import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { CrushyButton } from '../../components/CrushyButton';
import { CrushyScreen, SectionHeading } from '../../components/CrushyScreen';
import { FeatureCard } from '../../components/FeatureCard';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { useCrushyStore } from '../../store/useCrushyStore';

export default function HomeScreen() {
  const router = useRouter();
  const nickname = useCrushyStore((state) => state.nickname);
  const mood = useCrushyStore((state) => state.mood);
  const xp = useCrushyStore((state) => state.xp);
  const { palette } = useCrushyTheme();

  return (
    <CrushyScreen eyebrow="TA PETITE BULLE DE BONNE HUMEUR" title={`Coucou ${nickname} !`} subtitle="Prête à transformer une petite pause en bon moment ?">
      <View style={[styles.hero, { backgroundColor: palette.pink }]}>
        <View style={styles.heroCopy}>
          <Text style={[styles.heroEyebrow, { color: palette.text }]}>TA DOSE DU JOUR</Text>
          <Text style={[styles.heroTitle, { color: palette.text }]}>Un sourire{'\n'}à la fois.</Text>
          <Text style={[styles.heroSmall, { color: palette.text }]}>{xp} XP récoltés tout doucement</Text>
        </View>
        <View style={[styles.heroBadge, { backgroundColor: palette.surface }]}>
          <Text style={[styles.heroBadgeText, { color: palette.accent }]}>+{xp}</Text>
          <Text style={[styles.heroBadgeLabel, { color: palette.subtle }]}>XP</Text>
        </View>
      </View>

      <SectionHeading>Ton humeur</SectionHeading>
      <PressMoodCard mood={mood} onPress={() => router.push('/daily')} />

      <SectionHeading>À toi de choisir</SectionHeading>
      <FeatureCard
        title="Une partie rapide ?"
        description="Des mini-jeux pour rire et te surprendre."
        label="ZONE JEUX"
        href="/games"
        tint={palette.surfaceAlt}
      />
      <FeatureCard
        title="Un petit mot pour toi"
        description="Ouvre une enveloppe et découvre ta surprise."
        label="BOÎTE À SURPRISES"
        href="/surprises"
        tint={palette.surface}
      />
      <CrushyButton secondary onPress={() => router.push('/daily')}>Voir mon humeur du jour</CrushyButton>
    </CrushyScreen>
  );
}

function PressMoodCard({ mood, onPress }: { mood: string | null; onPress: () => void }) {
  const { palette } = useCrushyTheme();
  return (
    <View style={[styles.moodCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <View style={styles.moodText}>
        <Text style={[styles.moodTitle, { color: palette.text }]}>{mood ? `Aujourd’hui : ${mood}` : 'Comment tu te sens ?'}</Text>
        <Text style={[styles.moodSubtitle, { color: palette.subtle }]}>Une petite pensée à ton humeur.</Text>
      </View>
      <CrushyButton secondary onPress={onPress} style={styles.moodButton}>{mood ? 'Changer' : 'Choisir'}</CrushyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: designTokens.radius.xl, minHeight: 160, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroCopy: { flex: 1 },
  heroEyebrow: { fontSize: 10, letterSpacing: 1.1, fontFamily: designTokens.typography.bold },
  heroTitle: { fontSize: 28, lineHeight: 31, fontFamily: designTokens.typography.extraBold, marginTop: 7 },
  heroSmall: { fontSize: 12, marginTop: 8, opacity: 0.85 },
  heroBadge: { width: 60, height: 60, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  heroBadgeText: { fontSize: 18, fontFamily: designTokens.typography.extraBold },
  heroBadgeLabel: { fontSize: 10, marginTop: -2 },
  moodCard: { borderWidth: 1, borderRadius: designTokens.radius.lg, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moodText: { flex: 1 },
  moodTitle: { fontSize: 14, fontFamily: designTokens.typography.bold },
  moodSubtitle: { fontSize: 12, marginTop: 3 },
  moodButton: { width: 96, marginTop: 0, minHeight: 42, marginLeft: 10 },
});
