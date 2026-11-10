import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { ChunkyCard } from '../ChunkySurface';
import { CrushyButton } from '../CrushyButton';
import { CrushyMascot } from '../CrushyMascot';
import { GameFeedback } from './GameFeedback';
import { designTokens } from '../../theme/theme';
import { useCrushyStore } from '../../store/useCrushyStore';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { didCompleteTimedChallenge, timedChallenges } from '../../games/gameData';
import { GameOption } from './GameOption';

export function TimedChallengeGame() {
  const { palette } = useCrushyTheme();
  const completeGame = useCrushyStore((state) => state.completeGame);
  const hapticsEnabled = useCrushyStore((state) => state.hapticsEnabled);
  const [selectedChallengeId, setSelectedChallengeId] = useState('classic');
  const selectedChallenge = timedChallenges.find((challenge) => challenge.id === selectedChallengeId) ?? timedChallenges[0];
  const [running, setRunning] = useState(false);
  const [taps, setTaps] = useState(0);
  const [seconds, setSeconds] = useState<number>(selectedChallenge.timeLimit);
  const [result, setResult] = useState<'won' | 'lost' | null>(null);

  function triggerHaptic(duration = 20) {
    if (hapticsEnabled) {
      try {
        Vibration.vibrate(duration);
      } catch {
        // Ignoré
      }
    }
  }

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSeconds((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running || seconds > 0) return;
    setRunning(false);
    triggerHaptic(40);
    setResult('lost');
  }, [running, seconds]);

  function startChallenge() {
    triggerHaptic();
    setTaps(0);
    setSeconds(selectedChallenge.timeLimit);
    setResult(null);
    setRunning(true);
  }

  function registerTap() {
    if (!running) return;
    triggerHaptic(15);
    const nextTaps = taps + 1;
    setTaps(nextTaps);
    if (didCompleteTimedChallenge(nextTaps, selectedChallenge.targetTaps, seconds)) {
      triggerHaptic(50);
      setRunning(false);
      setResult('won');
      completeGame('timed-challenge', 25);
    }
  }

  const progressPercent = Math.min((taps / selectedChallenge.targetTaps) * 100, 100);

  return (
    <View style={styles.container}>
      <Text style={[styles.instructions, { color: palette.subtle }]}>
        Choisis une mission, puis tape {selectedChallenge.targetTaps} fois avant la fin des {selectedChallenge.timeLimit} secondes.
      </Text>

      {!running ? (
        <View style={styles.challengeChoices}>
          <Text style={[styles.choiceHeading, { color: palette.text }]}>Choisis ton défi</Text>
          {timedChallenges.map((challenge) => (
            <GameOption
              key={challenge.id}
              onPress={() => {
                setSelectedChallengeId(challenge.id);
                setTaps(0);
                setSeconds(challenge.timeLimit);
                setResult(null);
              }}
              selected={selectedChallenge.id === challenge.id}
            >
              {challenge.title} · {challenge.targetTaps} tapes en {challenge.timeLimit} s
            </GameOption>
          ))}
        </View>
      ) : null}

      <ChunkyCard
        depth={4}
        radius={designTokens.radius.xl}
        tint={seconds <= 4 && running ? palette.peach : palette.lavender}
        style={styles.timerCardWrap}
      >
        <View style={styles.timerCard}>
          <Text style={[styles.timer, { color: palette.text }]}>{seconds}</Text>
          <Text style={[styles.timerLabel, { color: palette.text }]}>SECONDES RESTANTES</Text>
        </View>
      </ChunkyCard>

      <View style={styles.progressContainer}>
        <View style={styles.counterRow}>
          <Text style={[styles.counterLabel, { color: palette.subtle }]}>Progression</Text>
          <Text style={[styles.counter, { color: palette.text }]}>
            {taps} / {selectedChallenge.targetTaps}
          </Text>
        </View>
        <View style={[styles.track, { backgroundColor: palette.surfaceAlt, borderColor: palette.ink }]}>
          <View style={[styles.fill, { backgroundColor: palette.accent, width: `${progressPercent}%` }]} />
        </View>
      </View>

      {running ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tape ici pour relever le défi"
          onPress={registerTap}
          style={({ pressed }) => [
            styles.tapButton,
            {
              backgroundColor: pressed ? palette.accent : palette.pink,
              borderColor: palette.ink,
              transform: [{ scale: pressed ? 0.93 : 1 }],
            },
          ]}
        >
          <Text style={[styles.tapButtonText, { color: palette.text }]}>TAPE ICI ! ⚡</Text>
        </Pressable>
      ) : null}

      {result ? (
        <View style={styles.resultContainer}>
          <CrushyMascot expression={result === 'won' ? 'énergique' : 'fatiguée'} size={110} interactive />
          <GameFeedback success={result === 'won'}>
            {result === 'won'
              ? `Défi éclair réussi en ${selectedChallenge.timeLimit - seconds}s ! Tu gagnes +25 XP ! 🚀`
              : 'Le chrono a sonné ! Tu y étais presque, relance pour battre le compte à rebours !'}
          </GameFeedback>
        </View>
      ) : null}

      {!running ? (
        <CrushyButton onPress={startChallenge}>
          {result ? 'Retenter le défi' : 'Lancer le défi'}
        </CrushyButton>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'stretch', marginTop: 10 },
  instructions: { fontSize: 14, lineHeight: 20 },
  challengeChoices: { marginTop: 8, marginBottom: 8 },
  choiceHeading: { fontSize: 13, fontFamily: designTokens.typography.bold },
  timerCardWrap: {
    width: 160,
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  timerCard: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  timer: { fontSize: 52, lineHeight: 58, fontFamily: designTokens.typography.extraBold },
  timerLabel: { fontSize: 9, letterSpacing: 1.1, fontFamily: designTokens.typography.bold, marginTop: 4 },
  progressContainer: {
    marginTop: 10,
    marginBottom: 16,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  counterLabel: { fontSize: 12, fontFamily: designTokens.typography.bold },
  counter: { fontSize: 13, fontFamily: designTokens.typography.extraBold },
  track: {
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
  tapButton: {
    width: 170,
    height: 64,
    borderRadius: designTokens.radius.pill,
    borderWidth: 2.5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  tapButtonText: { fontSize: 16, fontFamily: designTokens.typography.extraBold },
  resultContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
});
