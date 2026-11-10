import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChunkyCard } from '../../components/ChunkySurface';
import { CrushyButton } from '../../components/CrushyButton';
import { CrushyScreen } from '../../components/CrushyScreen';
import { CrushyMascot } from '../../components/CrushyMascot';
import { FeatureCard } from '../../components/FeatureCard';
import { defaultMoodLine, moodMeta } from '../../theme/moods';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { AvatarId, useCrushyStore } from '../../store/useCrushyStore';
import { useReducedMotion } from 'react-native-reanimated';

const avatarIcons: Record<AvatarId, keyof typeof Ionicons.glyphMap> = {
  heart: 'heart',
  sparkles: 'sparkles',
  sunny: 'sunny',
  moon: 'moon',
  flame: 'flame',
  planet: 'planet',
  flower: 'flower',
  paw: 'paw',
};

export default function HomeScreen() {
  const router = useRouter();
  const nickname = useCrushyStore((state) => state.nickname);
  const avatarId = useCrushyStore((state) => state.avatarId);
  const mood = useCrushyStore((state) => state.mood);
  const xp = useCrushyStore((state) => state.xp);
  const openedSurprises = useCrushyStore((state) => state.openedSurpriseIds.length);
  const unlockedBadges = useCrushyStore((state) => state.unlockedAchievements.length);

  const { palette, isDark } = useCrushyTheme();
  const reduceMotion = useReducedMotion();

  const heroTint = mood ? moodMeta[mood].tint(palette) : palette.pink;
  const avatarIcon = avatarIcons[avatarId] ?? 'heart';
  const pipSpeech = mood ? moodMeta[mood].line : defaultMoodLine;
  const level = Math.floor(xp / 100) + 1;

  return (
    <CrushyScreen>
      {/* En-tête avec profil et salutation */}
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.eyebrow, { color: palette.accent }]}>TA PETITE BULLE DE BONNE HUMEUR</Text>
          <Text style={[styles.screenTitle, { color: palette.text }]}>{`Coucou ${nickname} !`}</Text>
        </View>
        <Pressable
          accessibilityLabel="Ouvrir mon profil"
          accessibilityRole="button"
          onPress={() => router.push('/profile')}
          style={({ pressed }) => [
            styles.avatarBtn,
            {
              backgroundColor: palette.surface,
              borderColor: palette.ink,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
          ]}
        >
          <Ionicons name={avatarIcon} size={22} color={palette.accent} />
        </Pressable>
      </View>
      <Text style={[styles.screenSubtitle, { color: palette.subtle }]}>
        Prête à transformer une petite pause en un moment tout doux ? ✨
      </Text>

      {/* Carte Hero animée avec Pip & bulle de dialogue */}
      <View style={styles.heroWrap}>
        {!isDark ? <View style={[styles.heroShadow, { backgroundColor: palette.shadow }]} /> : null}
        <View style={[styles.hero, { backgroundColor: heroTint, borderColor: palette.ink }]}>
          <View style={styles.heroCopy}>
            <View style={[styles.heroBadge, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
              <Text style={[styles.heroEyebrow, { color: palette.accent }]}>NIVEAU {level} · {xp} XP</Text>
            </View>
            <Text style={[styles.heroTitle, { color: palette.text }]}>Un sourire{'\n'}à la fois.</Text>
            <View style={[styles.speechBubble, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
              <Text style={[styles.speechText, { color: palette.text }]} numberOfLines={2}>
                « {pipSpeech} »
              </Text>
            </View>
          </View>
          <View style={styles.mascotBox}>
            <CrushyMascot reduceMotion={reduceMotion} expression={mood ?? 'heureuse'} size={124} interactive />
          </View>
        </View>
      </View>

      {/* Raccourcis rapides en pilules */}
      <View style={styles.quickPillsRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/games')}
          style={[styles.quickPill, { backgroundColor: palette.surface, borderColor: palette.border }]}
        >
          <Text style={styles.quickPillEmoji}>🎮</Text>
          <Text style={[styles.quickPillText, { color: palette.text }]}>Mini-jeux</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/surprises')}
          style={[styles.quickPill, { backgroundColor: palette.surface, borderColor: palette.border }]}
        >
          <Text style={styles.quickPillEmoji}>🎁</Text>
          <Text style={[styles.quickPillText, { color: palette.text }]}>
            {openedSurprises > 0 ? `${openedSurprises} surprises` : 'Surprises'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/rewards')}
          style={[styles.quickPill, { backgroundColor: palette.surface, borderColor: palette.border }]}
        >
          <Text style={styles.quickPillEmoji}>🏆</Text>
          <Text style={[styles.quickPillText, { color: palette.text }]}>
            {unlockedBadges}/6 Badges
          </Text>
        </Pressable>
      </View>

      {/* Carte humeur du jour */}
      <Text style={[styles.sectionLabel, { color: palette.subtle }]}>TON HUMEUR DU JOUR</Text>
      <PressMoodCard mood={mood} onPress={() => router.push('/daily')} />

      {/* Activités suggérées */}
      <Text style={[styles.sectionLabel, { color: palette.subtle }]}>À TOI DE CHOISIR</Text>
      <FeatureCard
        title="La zone jeux"
        description="Memory, Tu préfères, Défi chrono, Devine le mot..."
        label="6 MINI-JEUX DISPONIBLES"
        href="/games"
        tint={palette.surfaceAlt}
        emoji="🎮"
      />
      <FeatureCard
        title="Un petit mot pour toi"
        description="Ouvre une enveloppe secrète ou programme une douceur pour demain."
        label="BOÎTE À SURPRISES"
        href="/surprises"
        tint={palette.mint}
        emoji="🎁"
      />
      <FeatureCard
        title="Bande-son personnalisée"
        description="Des playlists Spotify et morceaux sélectionnés selon ton humeur."
        label="AMBIANCE MUSIQUE"
        href="/music"
        tint={palette.lavender}
        emoji="🎵"
      />

      <View style={styles.bottomSpace} />
    </CrushyScreen>
  );
}

function PressMoodCard({ mood, onPress }: { mood: string | null; onPress: () => void }) {
  const { palette } = useCrushyTheme();
  const meta = mood ? moodMeta[mood as keyof typeof moodMeta] : null;

  return (
    <ChunkyCard radius={designTokens.radius.lg} depth={3} tint={palette.surface}>
      <View style={styles.moodCard}>
        <View style={[styles.moodEmojiBox, { backgroundColor: meta ? meta.tint(palette) : palette.surfaceAlt, borderColor: palette.ink }]}>
          <Text style={styles.moodBigEmoji}>{meta ? meta.emoji : '😊'}</Text>
        </View>
        <View style={styles.moodText}>
          <Text style={[styles.moodTitle, { color: palette.text }]}>
            {mood ? `Aujourd’hui : ${mood}` : 'Comment te sens-tu ?'}
          </Text>
          <Text style={[styles.moodSubtitle, { color: palette.subtle }]}>
            {mood ? 'Touche pour réajuster ton rituel du jour.' : 'Une pensée douce adaptée à ton humeur.'}
          </Text>
        </View>
        <CrushyButton secondary onPress={onPress} style={styles.moodButton}>
          {mood ? 'Changer' : 'Choisir'}
        </CrushyButton>
      </View>
    </ChunkyCard>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerText: {
    flex: 1,
    paddingRight: 10,
  },
  avatarBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.8,
    fontFamily: designTokens.typography.bold,
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: designTokens.typography.extraBold,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: designTokens.typography.regular,
    marginTop: 2,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.6,
    fontFamily: designTokens.typography.bold,
    marginTop: 22,
    marginBottom: 10,
  },
  heroWrap: { marginBottom: 14 },
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
    minHeight: 164,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: designTokens.chunky.outline,
  },
  heroCopy: { flex: 1, paddingRight: 4 },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
    marginBottom: 6,
  },
  heroEyebrow: { fontSize: 10, letterSpacing: 0.8, fontFamily: designTokens.typography.bold },
  heroTitle: { fontSize: 26, lineHeight: 29, fontFamily: designTokens.typography.extraBold, marginBottom: 8 },
  speechBubble: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: designTokens.radius.md,
    borderWidth: 1.5,
  },
  speechText: {
    fontSize: 11,
    lineHeight: 15,
    fontFamily: designTokens.typography.bold,
  },
  mascotBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  quickPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
    gap: 5,
  },
  quickPillEmoji: {
    fontSize: 13,
  },
  quickPillText: {
    fontSize: 11,
    fontFamily: designTokens.typography.bold,
  },
  moodCard: {
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  moodEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodBigEmoji: {
    fontSize: 22,
  },
  moodText: { flex: 1 },
  moodTitle: { fontSize: 14, fontFamily: designTokens.typography.bold, textTransform: 'capitalize' },
  moodSubtitle: { fontSize: 11, lineHeight: 15, marginTop: 2 },
  moodButton: { minWidth: 84, marginTop: 0, minHeight: 40 },
  bottomSpace: { height: 28 },
});
