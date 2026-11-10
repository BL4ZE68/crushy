import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { ChunkyCard } from '../../components/ChunkySurface';
import { CrushyMascot } from '../../components/CrushyMascot';
import { CrushyScreen, SectionHeading } from '../../components/CrushyScreen';
import { FeatureCard } from '../../components/FeatureCard';
import { useCrushyButtonSound } from '../../components/CrushyAudioProvider';
import { designTokens } from '../../theme/theme';
import { useCrushyStore } from '../../store/useCrushyStore';
import { useCrushyTheme } from '../../theme/useCrushyTheme';

type CategoryFilter = 'all' | 'quick' | 'puzzle' | 'dilemma';

type GameMeta = {
  slug: string;
  title: string;
  description: string;
  label: string;
  emoji: string;
  xpReward: number;
  category: CategoryFilter;
  tintKey: 'pink' | 'yellow' | 'mint' | 'peach' | 'sky' | 'lavender';
};

const gamesList: GameMeta[] = [
  {
    slug: 'memory',
    title: 'Le Memory de Pip',
    description: 'Choisis 6, 12 ou 32 cartes et teste ta mémoire visuelle.',
    label: 'NOUVEAU · CARTES',
    emoji: '🃏',
    xpReward: 20,
    category: 'puzzle',
    tintKey: 'mint',
  },
  {
    slug: 'would-you-rather',
    title: 'Tu préfères ?',
    description: 'Soixante dilemmes à découvrir, douze par série.',
    label: 'CHOIX RAPIDES',
    emoji: '🤔',
    xpReward: 15,
    category: 'dilemma',
    tintKey: 'peach',
  },
  {
    slug: 'word-guess',
    title: 'Devine le mot',
    description: 'Suis les 3 indices et découvre le mot mystère masqué.',
    label: 'ÉNINGME DU JOUR',
    emoji: '🔤',
    xpReward: 20,
    category: 'puzzle',
    tintKey: 'lavender',
  },
  {
    slug: 'timed-challenge',
    title: 'Défi chrono',
    description: 'Choisis ton objectif de vitesse et bats le chrono.',
    label: 'RÉFLEXES EXPRESS',
    emoji: '⏱️',
    xpReward: 25,
    category: 'quick',
    tintKey: 'yellow',
  },
  {
    slug: 'truth-or-dare',
    title: 'Action ou vérité',
    description: 'Des questions bienveillantes et petits défis à ton rythme.',
    label: '5 CATÉGORIES',
    emoji: '🎲',
    xpReward: 5,
    category: 'dilemma',
    tintKey: 'sky',
  },
  {
    slug: 'personality-quiz',
    title: 'Quiz de personnalité',
    description: 'Découvre quel petit personnage et humeur te correspondent.',
    label: 'QUIZ DOUX',
    emoji: '✨',
    xpReward: 20,
    category: 'dilemma',
    tintKey: 'pink',
  },
];

const categoryTabs: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'Tous les jeux' },
  { id: 'puzzle', label: 'Réflexion & Mots' },
  { id: 'dilemma', label: 'Choix & Quiz' },
  { id: 'quick', label: 'Express' },
];

export default function GamesScreen() {
  const router = useRouter();
  const { palette } = useCrushyTheme();
  const playButtonSound = useCrushyButtonSound();
  const hapticsEnabled = useCrushyStore((state) => state.hapticsEnabled);
  const gameCompletions = useCrushyStore((state) => state.gameCompletions);
  const mood = useCrushyStore((state) => state.mood);

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const totalCompletedGames = Object.values(gameCompletions).reduce((sum, count) => sum + count, 0);

  function triggerHaptic() {
    if (hapticsEnabled) {
      try {
        Vibration.vibrate(20);
      } catch {
        // Ignoré
      }
    }
  }

  function handleRandomGame() {
    triggerHaptic();
    playButtonSound();
    const randomIndex = Math.floor(Math.random() * gamesList.length);
    const chosen = gamesList[randomIndex];
    router.push({ pathname: '/game/[slug]', params: { slug: chosen.slug } });
  }

  const filteredGames =
    activeCategory === 'all'
      ? gamesList
      : gamesList.filter((g) => g.category === activeCategory);

  return (
    <CrushyScreen
      eyebrow="ZONE DE JEUX · PETIT MOMENT POUR TOI"
      title="La zone jeux"
      subtitle="Choisis un mini-jeu, détends-toi et gagne des points d’expérience tout en douceur."
    >
      {/* Bannière de statistiques & compteur */}
      <View style={styles.statsBanner}>
        <View style={[styles.statChip, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
          <Text style={styles.statChipIcon}>🎮</Text>
          <Text style={[styles.statChipText, { color: palette.text }]}>
            {totalCompletedGames} {totalCompletedGames > 1 ? 'parties jouées' : 'partie jouée'}
          </Text>
        </View>

        <View style={[styles.statChip, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
          <Text style={styles.statChipIcon}>⭐</Text>
          <Text style={[styles.statChipText, { color: palette.text }]}>
            +{filteredGames.reduce((acc, g) => acc + g.xpReward, 0)} XP disponibles
          </Text>
        </View>
      </View>

      {/* Carte magique : Laisse Pip choisir */}
      <ChunkyCard tint={palette.lavender} radius={designTokens.radius.xl} depth={4} style={styles.magicCardWrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Laisse Pip choisir un jeu au hasard"
          onPress={handleRandomGame}
          style={styles.magicCardInner}
        >
          <View style={styles.magicCopy}>
            <View style={[styles.magicBadge, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
              <Text style={[styles.magicBadgeText, { color: palette.accent }]}>SURPRISE CHANCEUSE</Text>
            </View>
            <Text style={[styles.magicTitle, { color: palette.text }]}>Laisse Pip choisir !</Text>
            <Text style={[styles.magicDesc, { color: palette.text }]}>
              Envie de jouer sans réfléchir ? Touche ici et lance un jeu surprise adapté à ton humeur.
            </Text>
          </View>
          <CrushyMascot expression={mood ?? 'heureuse'} size={88} interactive={false} />
        </Pressable>
      </ChunkyCard>

      {/* Filtres par catégorie */}
      <SectionHeading>Choisis ton aventure</SectionHeading>
      <View style={styles.filtersScroll}>
        {categoryTabs.map((tab) => {
          const isSelected = activeCategory === tab.id;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={tab.id}
              onPress={() => {
                triggerHaptic();
                setActiveCategory(tab.id);
              }}
              style={[
                styles.filterTab,
                {
                  backgroundColor: isSelected ? palette.text : palette.surface,
                  borderColor: isSelected ? palette.ink : palette.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color: isSelected ? palette.background : palette.text,
                    fontFamily: isSelected ? designTokens.typography.bold : designTokens.typography.regular,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Liste des jeux */}
      <View style={styles.gamesGrid}>
        {filteredGames.map((game) => {
          const playedCount = gameCompletions[game.slug] ?? 0;
          const tint = palette[game.tintKey] ?? palette.surface;
          const badgeText = playedCount > 0 ? `${playedCount}x terminé` : game.label;

          return (
            <View key={game.slug} style={styles.gameItemWrap}>
              <FeatureCard
                description={game.description}
                emoji={game.emoji}
                href={{ pathname: '/game/[slug]', params: { slug: game.slug } }}
                label={`${badgeText} · +${game.xpReward} XP`}
                title={game.title}
                tint={tint}
              />
            </View>
          );
        })}
      </View>

      <View style={styles.bottomSpace} />
    </CrushyScreen>
  );
}

const styles = StyleSheet.create({
  statsBanner: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 8,
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
    gap: 6,
  },
  statChipIcon: {
    fontSize: 14,
  },
  statChipText: {
    fontSize: 12,
    fontFamily: designTokens.typography.bold,
  },
  magicCardWrap: {
    marginTop: 10,
    marginBottom: 6,
  },
  magicCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  magicCopy: {
    flex: 1,
  },
  magicBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
    marginBottom: 6,
  },
  magicBadgeText: {
    fontSize: 10,
    fontFamily: designTokens.typography.bold,
  },
  magicTitle: {
    fontSize: 20,
    fontFamily: designTokens.typography.extraBold,
  },
  magicDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    opacity: 0.9,
  },
  filtersScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: -4,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
  },
  filterTabText: {
    fontSize: 12,
  },
  gamesGrid: {
    gap: 4,
  },
  gameItemWrap: {
    marginBottom: 2,
  },
  bottomSpace: {
    height: 32,
  },
});
