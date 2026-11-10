import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { ChunkyCard } from '../ChunkySurface';
import { CrushyButton } from '../CrushyButton';
import { CrushyMascot } from '../CrushyMascot';
import { GameOption } from './GameOption';
import { useCrushyButtonSound } from '../CrushyAudioProvider';
import { designTokens } from '../../theme/theme';
import { useCrushyStore } from '../../store/useCrushyStore';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { memoryLevels, memoryPairs, type MemoryLevel } from '../../games/gameData';

type CardItem = {
  id: number;
  symbol: string;
  label: string;
  tint: string;
  isFlipped: boolean;
  isMatched: boolean;
};

function generateShuffledCards(pairCount: number): CardItem[] {
  const pairs = memoryPairs.slice(0, pairCount);
  const deck = [...pairs, ...pairs].map((item, index) => ({
    id: index,
    symbol: item.symbol,
    label: item.label,
    tint: item.tint,
    isFlipped: false,
    isMatched: false,
  }));

  // Mélange de Fisher-Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

export function MemoryGame() {
  const { palette } = useCrushyTheme();
  const playButtonSound = useCrushyButtonSound();
  const completeGame = useCrushyStore((state) => state.completeGame);
  const hapticsEnabled = useCrushyStore((state) => state.hapticsEnabled);

  const [selectedLevelId, setSelectedLevelId] = useState<MemoryLevel['id']>(memoryLevels[0].id);
  const selectedLevel = memoryLevels.find((level) => level.id === selectedLevelId) ?? memoryLevels[0];
  const [cards, setCards] = useState<CardItem[]>(() => generateShuffledCards(memoryLevels[0].pairCount));
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
  }, []);

  function triggerHaptic(duration = 20) {
    if (hapticsEnabled) {
      try {
        Vibration.vibrate(duration);
      } catch {
        // Ignoré
      }
    }
  }

  function handleCardPress(index: number) {
    if (isLocked) return;
    const card = cards[index];
    if (card.isFlipped || card.isMatched) return;

    triggerHaptic(15);
    playButtonSound();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedIndices, index];
    setSelectedIndices(newSelected);

    if (newSelected.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);

      const [firstIdx, secondIdx] = newSelected;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.symbol === secondCard.symbol) {
        // Paire trouvée !
        triggerHaptic(40);
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          setCards((prev) => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;
            return updated;
          });
          const nextPairs = matchedPairs + 1;
          setMatchedPairs(nextPairs);
          setSelectedIndices([]);
          setIsLocked(false);

          if (nextPairs === selectedLevel.pairCount) {
            setHasWon(true);
            completeGame('memory', 20);
          }
        }, 400);
      } else {
        // Pas de paire : on retourne après un court délai
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          setCards((prev) => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setSelectedIndices([]);
          setIsLocked(false);
        }, 800);
      }
    }
  }

  function handleRestart() {
    triggerHaptic();
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setCards(generateShuffledCards(selectedLevel.pairCount));
    setSelectedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsLocked(false);
    setHasWon(false);
  }

  function handleLevelChange(level: MemoryLevel) {
    triggerHaptic();
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setSelectedLevelId(level.id);
    setCards(generateShuffledCards(level.pairCount));
    setSelectedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsLocked(false);
    setHasWon(false);
  }

  function renderLevelPicker() {
    return (
      <View style={styles.levelPicker}>
        <Text style={[styles.levelHeading, { color: palette.text }]}>Choisis ton niveau</Text>
        <View style={styles.levelOptions}>
          {memoryLevels.map((level) => (
            <GameOption
              key={level.id}
              onPress={() => handleLevelChange(level)}
              selected={selectedLevel.id === level.id}
              style={styles.levelOption}
            >
              {level.cardCount} cartes
            </GameOption>
          ))}
        </View>
      </View>
    );
  }

  if (hasWon) {
    const threeStarLimit = Math.ceil(selectedLevel.pairCount * (4 / 3));
    const twoStarLimit = selectedLevel.pairCount * 2;
    const starRating = moves <= threeStarLimit ? '⭐⭐⭐' : moves <= twoStarLimit ? '⭐⭐' : '⭐';
    const compliment =
      moves <= threeStarLimit
        ? 'Mémoire photographique spectaculaire !'
        : moves <= twoStarLimit
        ? 'Très belle concentration et joli jeu !'
        : 'Bravo pour ta persévérance et ta patience !';

    return (
      <View style={styles.victoryContainer}>
        <CrushyMascot expression="heureuse" size={130} interactive />
        {renderLevelPicker()}
        <ChunkyCard tint={palette.pink} radius={designTokens.radius.xl} depth={4} style={styles.victoryCardWrap}>
          <View style={styles.victoryCard}>
            <Text style={[styles.starsText, { color: palette.text }]}>{starRating}</Text>
            <Text style={[styles.victoryTitle, { color: palette.text }]}>Toutes les paires réunies !</Text>
            <Text style={[styles.victorySubtitle, { color: palette.text }]}>{compliment}</Text>
            <View style={[styles.victoryStatsBadge, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
              <Text style={[styles.victoryStatsText, { color: palette.accent }]}>
                {moves} coups · +20 XP gagnés ✨
              </Text>
            </View>
          </View>
        </ChunkyCard>
        <CrushyButton onPress={handleRestart}>Rejouer une partie</CrushyButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* En-tête des compteurs */}
      <View style={styles.statsHeader}>
        <View style={[styles.statChip, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.statChipLabel, { color: palette.subtle }]}>Paires :</Text>
          <Text style={[styles.statChipValue, { color: palette.text }]}>
            {matchedPairs} / {selectedLevel.pairCount}
          </Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.statChipLabel, { color: palette.subtle }]}>Coups :</Text>
          <Text style={[styles.statChipValue, { color: palette.text }]}>{moves}</Text>
        </View>
      </View>

      {renderLevelPicker()}

      {/* Grille de cartes */}
      <View style={styles.grid}>
        {cards.map((card, index) => {
          const isRevealed = card.isFlipped || card.isMatched;
          return (
            <Pressable
              accessibilityLabel={isRevealed ? card.label : `Carte numéro ${index + 1}`}
              accessibilityRole="button"
              key={card.id}
              onPress={() => handleCardPress(index)}
              style={({ pressed }) => [
                styles.cardPressable,
                {
                  width: `${100 / selectedLevel.columns - 4}%`,
                  transform: [{ scale: pressed && !isRevealed ? 0.94 : 1 }],
                  opacity: card.isMatched ? 0.75 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.cardSurface,
                  {
                    backgroundColor: isRevealed ? card.tint : palette.surface,
                    borderColor: isRevealed ? palette.ink : palette.border,
                    borderWidth: isRevealed ? 2.5 : 1.5,
                  },
                ]}
              >
                {isRevealed ? (
                  <Text style={styles.cardEmoji}>{card.symbol}</Text>
                ) : (
                  <Text style={[styles.cardCover, { color: palette.accent }]}>✨</Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.hintNote, { color: palette.subtle }]}>
        Retourne deux cartes identiques pour former une paire. Prends ton temps ! 💖
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelPicker: { marginBottom: 14 },
  levelHeading: { fontSize: 13, fontFamily: designTokens.typography.bold },
  levelOptions: { flexDirection: 'row', gap: 8 },
  levelOption: { flex: 1, alignItems: 'center', paddingHorizontal: 6 },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
  },
  statChipLabel: {
    fontSize: 12,
    fontFamily: designTokens.typography.regular,
  },
  statChipValue: {
    fontSize: 14,
    fontFamily: designTokens.typography.extraBold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardPressable: {
    aspectRatio: 0.88,
  },
  cardSurface: {
    flex: 1,
    borderRadius: designTokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 34,
  },
  cardCover: {
    fontSize: 22,
  },
  hintNote: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 18,
    lineHeight: 18,
  },
  victoryContainer: {
    alignItems: 'center',
    marginTop: 14,
  },
  victoryCardWrap: {
    width: '100%',
    marginTop: 16,
    marginBottom: 14,
  },
  victoryCard: {
    padding: 20,
    alignItems: 'center',
  },
  starsText: {
    fontSize: 28,
    marginBottom: 6,
  },
  victoryTitle: {
    fontSize: 22,
    fontFamily: designTokens.typography.extraBold,
    textAlign: 'center',
  },
  victorySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  victoryStatsBadge: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: designTokens.radius.pill,
    borderWidth: 2,
  },
  victoryStatsText: {
    fontSize: 13,
    fontFamily: designTokens.typography.bold,
  },
});
