import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CrushyButton } from '../CrushyButton';
import { GameFeedback } from './GameFeedback';
import { designTokens } from '../../theme/theme';
import { useCrushyStore } from '../../store/useCrushyStore';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { evaluateWordGuess, wordRiddles } from '../../games/gameData';

const MAX_ATTEMPTS = 3;

export function WordGuessGame() {
  const { palette } = useCrushyTheme();
  const completeGame = useCrushyStore((state) => state.completeGame);
  const [riddleIndex, setRiddleIndex] = useState(0);
  const [value, setValue] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<'won' | 'lost' | null>(null);
  const riddle = wordRiddles[riddleIndex];

  function submitGuess() {
    if (result || value.trim().length === 0) return;
    const outcome = evaluateWordGuess(value, riddle.answer, MAX_ATTEMPTS - attempts);
    if (outcome === 'correct') {
      setResult('won');
      completeGame('word-guess', 20);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setValue('');
    if (outcome === 'out-of-attempts') setResult('lost');
  }

  function nextRiddle() {
    setRiddleIndex((index) => (index + 1) % wordRiddles.length);
    setValue('');
    setAttempts(0);
    setResult(null);
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.attempts, { color: palette.subtle }]}>Essai {Math.min(attempts + 1, MAX_ATTEMPTS)} sur {MAX_ATTEMPTS}</Text>
      <View style={[styles.hintCard, { backgroundColor: palette.lavender }]}>
        <Text style={[styles.hintTitle, { color: palette.text }]}>Indice {Math.min(attempts + 1, riddle.hints.length)}</Text>
        <Text style={[styles.hint, { color: palette.text }]}>{riddle.hints[Math.min(attempts, riddle.hints.length - 1)]}</Text>
      </View>
      {result ? (
        <>
          <GameFeedback success={result === 'won'}>
            {result === 'won' ? 'Bien joué, c’est ça ! +20 XP' : `Bien tenté ! Le mot était « ${riddle.answer} ». Essaie le suivant !`}
          </GameFeedback>
          <CrushyButton onPress={nextRiddle}>Mot suivant</CrushyButton>
        </>
      ) : (
        <>
          <TextInput
            accessibilityLabel="Ta réponse"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setValue}
            onSubmitEditing={submitGuess}
            placeholder="Écris ta réponse"
            placeholderTextColor={palette.subtle}
            returnKeyType="send"
            style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
            value={value}
          />
          {attempts > 0 ? <Text style={[styles.feedback, { color: palette.accent }]}>Pas tout à fait… un nouvel indice t’attend !</Text> : null}
          <CrushyButton disabled={!value.trim()} onPress={submitGuess}>Valider ma réponse</CrushyButton>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  attempts: { fontSize: 12, fontFamily: designTokens.typography.bold },
  hintCard: { borderRadius: designTokens.radius.lg, padding: 18, marginTop: 10 },
  hintTitle: { fontSize: 12, fontFamily: designTokens.typography.bold, marginBottom: 6 },
  hint: { fontSize: 18, lineHeight: 25, fontFamily: designTokens.typography.extraBold },
  input: { borderWidth: 1, borderRadius: designTokens.radius.md, minHeight: 52, paddingHorizontal: 14, fontSize: 16, marginTop: 17, fontFamily: designTokens.typography.regular },
  feedback: { fontSize: 13, marginTop: 10 },
});
