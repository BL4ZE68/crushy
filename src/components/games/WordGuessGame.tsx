import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, Vibration, View } from 'react-native';
import { ChunkyCard } from '../ChunkySurface';
import { CrushyButton } from '../CrushyButton';
import { CrushyMascot } from '../CrushyMascot';
import { GameFeedback } from './GameFeedback';
import { designTokens } from '../../theme/theme';
import { useCrushyStore } from '../../store/useCrushyStore';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { evaluateWordGuess, getDailyIndex, wordRiddles } from '../../games/gameData';

const MAX_ATTEMPTS = 3;

export function WordGuessGame() {
  const { palette } = useCrushyTheme();
  const completeGame = useCrushyStore((state) => state.completeGame);
  const hapticsEnabled = useCrushyStore((state) => state.hapticsEnabled);
  const [riddleIndex, setRiddleIndex] = useState(() => getDailyIndex(wordRiddles.length, new Date(), 11));
  const [value, setValue] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<'won' | 'lost' | null>(null);
  const [revealedFirstLetter, setRevealedFirstLetter] = useState(false);
  const riddle = wordRiddles[riddleIndex];

  function triggerHaptic(duration = 20) {
    if (hapticsEnabled) {
      try {
        Vibration.vibrate(duration);
      } catch {
        // Ignoré
      }
    }
  }

  function submitGuess() {
    if (result || value.trim().length === 0) return;
    const outcome = evaluateWordGuess(value, riddle.answer, MAX_ATTEMPTS - attempts);
    if (outcome === 'correct') {
      triggerHaptic(40);
      setResult('won');
      completeGame('word-guess', 20);
      return;
    }

    triggerHaptic(25);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setValue('');
    if (outcome === 'out-of-attempts') setResult('lost');
  }

  function nextRiddle() {
    triggerHaptic();
    setRiddleIndex((index) => (index + 1) % wordRiddles.length);
    setValue('');
    setAttempts(0);
    setResult(null);
    setRevealedFirstLetter(false);
  }

  const cleanLetters = riddle.answer.replace(/[^a-zA-Zà-üÀ-Ü]/g, '');
  const letterCount = cleanLetters.length;
  const firstLetter = riddle.answer.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.attempts, { color: palette.subtle }]}>
          Essai {Math.min(attempts + 1, MAX_ATTEMPTS)} sur {MAX_ATTEMPTS}
        </Text>
        <View style={[styles.lengthBadge, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
          <Text style={[styles.lengthText, { color: palette.accent }]}>{letterCount} lettres</Text>
        </View>
      </View>

      <ChunkyCard tint={palette.lavender} radius={designTokens.radius.lg} depth={3} style={styles.hintWrap}>
        <View style={styles.hintCard}>
          <Text style={[styles.hintTitle, { color: palette.text }]}>
            Indice {Math.min(attempts + 1, riddle.hints.length)}
          </Text>
          <Text style={[styles.hint, { color: palette.text }]}>
            {riddle.hints[Math.min(attempts, riddle.hints.length - 1)]}
          </Text>
        </View>
      </ChunkyCard>

      {/* Mot masqué interactif */}
      <View style={[styles.maskedRow, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.maskedLetters, { color: palette.text }]}>
          {revealedFirstLetter
            ? `${firstLetter} ` + '• '.repeat(Math.max(letterCount - 1, 0)).trim()
            : '• '.repeat(letterCount).trim()}
        </Text>
        {!revealedFirstLetter && !result && attempts >= 1 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              triggerHaptic();
              setRevealedFirstLetter(true);
            }}
            style={[styles.revealBtn, { backgroundColor: palette.surfaceAlt, borderColor: palette.ink }]}
          >
            <Text style={[styles.revealBtnText, { color: palette.accent }]}>💡 Révéler la 1ère lettre</Text>
          </Pressable>
        ) : null}
      </View>

      {result ? (
        <View style={styles.resultBox}>
          <CrushyMascot expression={result === 'won' ? 'heureuse' : 'triste'} size={100} interactive />
          <GameFeedback success={result === 'won'}>
            {result === 'won'
              ? `Bravo, c’est bien « ${riddle.answer} » ! +20 XP ✨`
              : `Bien essayé ! Le mot secret était « ${riddle.answer} ». Tente le suivant !`}
          </GameFeedback>
          <CrushyButton onPress={nextRiddle}>Mot suivant</CrushyButton>
        </View>
      ) : (
        <>
          <TextInput
            accessibilityLabel="Ta réponse"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setValue}
            onSubmitEditing={submitGuess}
            placeholder="Écris le mot ici…"
            placeholderTextColor={palette.subtle}
            returnKeyType="send"
            style={[
              styles.input,
              {
                backgroundColor: palette.surface,
                borderColor: attempts > 0 ? palette.accent : palette.border,
                color: palette.text,
              },
            ]}
            value={value}
          />
          {attempts > 0 ? (
            <Text style={[styles.feedback, { color: palette.accent }]}>
              Pas tout à fait… un nouvel indice plus précis t’attend !
            </Text>
          ) : null}
          <CrushyButton disabled={!value.trim()} onPress={submitGuess}>
            Valider ma réponse
          </CrushyButton>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  attempts: { fontSize: 12, fontFamily: designTokens.typography.bold },
  lengthBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
  },
  lengthText: {
    fontSize: 11,
    fontFamily: designTokens.typography.bold,
  },
  hintWrap: { marginTop: 4 },
  hintCard: { padding: 18 },
  hintTitle: { fontSize: 11, letterSpacing: 0.8, fontFamily: designTokens.typography.bold, marginBottom: 6 },
  hint: { fontSize: 18, lineHeight: 25, fontFamily: designTokens.typography.extraBold },
  maskedRow: {
    marginTop: 14,
    padding: 14,
    borderRadius: designTokens.radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskedLetters: {
    fontSize: 22,
    letterSpacing: 4,
    fontFamily: designTokens.typography.extraBold,
  },
  revealBtn: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
  },
  revealBtnText: {
    fontSize: 11,
    fontFamily: designTokens.typography.bold,
  },
  input: {
    borderWidth: 2,
    borderRadius: designTokens.radius.md,
    minHeight: 52,
    paddingHorizontal: 14,
    fontSize: 16,
    marginTop: 16,
    fontFamily: designTokens.typography.bold,
  },
  feedback: { fontSize: 13, marginTop: 8, fontFamily: designTokens.typography.regular },
  resultBox: {
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
});
