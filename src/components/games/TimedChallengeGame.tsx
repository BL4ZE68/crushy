import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CrushyButton } from '../CrushyButton';
import { GameFeedback } from './GameFeedback';
import { designTokens } from '../../theme/theme';
import { useCrushyStore } from '../../store/useCrushyStore';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { didCompleteTimedChallenge } from '../../games/gameData';

const TARGET_TAPS = 10;
const TIME_LIMIT = 12;

export function TimedChallengeGame() {
  const { palette } = useCrushyTheme();
  const completeGame = useCrushyStore((state) => state.completeGame);
  const [running, setRunning] = useState(false);
  const [taps, setTaps] = useState(0);
  const [seconds, setSeconds] = useState(TIME_LIMIT);
  const [result, setResult] = useState<'won' | 'lost' | null>(null);

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
    setResult('lost');
  }, [running, seconds]);

  function startChallenge() {
    setTaps(0);
    setSeconds(TIME_LIMIT);
    setResult(null);
    setRunning(true);
  }

  function registerTap() {
    if (!running) return;
    const nextTaps = taps + 1;
    setTaps(nextTaps);
    if (didCompleteTimedChallenge(nextTaps, TARGET_TAPS, seconds)) {
      setRunning(false);
      setResult('won');
      completeGame('timed-challenge', 25);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.instructions, { color: palette.subtle }]}>Tape {TARGET_TAPS} fois sur le bouton avant la fin du compte à rebours.</Text>
      <View style={[styles.timerCard, { backgroundColor: palette.lavender }]}>
        <Text style={[styles.timer, { color: palette.text }]}>{seconds}</Text>
        <Text style={[styles.timerLabel, { color: palette.text }]}>SECONDES</Text>
      </View>
      <Text style={[styles.counter, { color: palette.text }]}>{taps} / {TARGET_TAPS}</Text>
      {running ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tape ici pour relever le défi"
          onPress={registerTap}
          style={({ pressed }) => [styles.tapButton, { backgroundColor: pressed ? palette.accent : palette.pink }]}
        >
          <Text style={[styles.tapButtonText, { color: palette.text }]}>TAPE ICI !</Text>
        </Pressable>
      ) : null}
      {result ? <GameFeedback success={result === 'won'}>{result === 'won' ? 'Défi réussi ! Tu gagnes 25 XP !' : 'Le chrono est terminé. Pas grave, tu peux réessayer !'}</GameFeedback> : null}
      {!running ? <CrushyButton onPress={startChallenge}>{result ? 'Réessayer' : 'Lancer le défi'}</CrushyButton> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'stretch', marginTop: 10 },
  instructions: { fontSize: 14, lineHeight: 20 },
  timerCard: { width: 150, height: 150, borderRadius: 56, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  timer: { fontSize: 52, lineHeight: 58, fontFamily: designTokens.typography.extraBold },
  timerLabel: { fontSize: 10, letterSpacing: 1.1, fontFamily: designTokens.typography.bold },
  counter: { textAlign: 'center', fontSize: 17, fontFamily: designTokens.typography.bold, marginTop: 17 },
  tapButton: { width: 148, height: 58, borderRadius: designTokens.radius.pill, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  tapButtonText: { fontSize: 15, fontFamily: designTokens.typography.extraBold },
});
