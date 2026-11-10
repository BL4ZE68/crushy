import { useEffect, useState } from 'react';
import { StyleSheet, Text, Vibration, View } from 'react-native';
import { ChunkyCard } from '../ChunkySurface';
import { CrushyButton } from '../CrushyButton';
import { CrushyMascot } from '../CrushyMascot';
import { GameFeedback } from './GameFeedback';
import { GameOption } from './GameOption';
import { designTokens } from '../../theme/theme';
import { useCrushyStore } from '../../store/useCrushyStore';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import {
  ChoiceQuestion,
  getDailyIndex,
  getSessionQuestionIndex,
  WOULD_YOU_RATHER_QUESTION_COUNT,
  wouldYouRatherQuestions,
} from '../../games/gameData';
import { fetchPublishedGameQuestions } from '../../lib/publicContent';

export function WouldYouRatherGame() {
  const { palette } = useCrushyTheme();
  const completeGame = useCrushyStore((state) => state.completeGame);
  const hapticsEnabled = useCrushyStore((state) => state.hapticsEnabled);
  const [questionIndex, setQuestionIndex] = useState(() => getDailyIndex(wouldYouRatherQuestions.length, new Date(), 23));
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<ChoiceQuestion[]>([]);
  const [contentError, setContentError] = useState('');
  const questions = [...wouldYouRatherQuestions, ...customQuestions];
  const question = questions[questionIndex];

  function triggerHaptic() {
    if (hapticsEnabled) {
      try {
        Vibration.vibrate(20);
      } catch {
        // Ignoré
      }
    }
  }

  useEffect(() => {
    let active = true;
    void fetchPublishedGameQuestions('would-you-rather')
      .then((items) => {
        if (!active) return;
        setCustomQuestions(items
          .filter((item) => item.kind === 'choice' && item.choices.length === 2)
          .map((item) => ({
            id: item.id,
            prompt: item.prompt,
            choices: [item.choices[0], item.choices[1]],
            reactions: item.reactions.length === 2
              ? [item.reactions[0], item.reactions[1]]
              : ['Chaque choix a son petit charme !', 'Ton intuition a tranché !'],
          })));
      })
      .catch((error: unknown) => {
        if (active) setContentError(error instanceof Error ? error.message : 'Les questions personnalisées sont indisponibles.');
      });
    return () => {
      active = false;
    };
  }, []);

  function selectOption(index: number) {
    if (selected !== null) return;
    triggerHaptic();
    setSelected(index);
  }

  function continueGame() {
    triggerHaptic();
    if (questionNumber === WOULD_YOU_RATHER_QUESTION_COUNT) {
      completeGame('would-you-rather', 15);
      setFinished(true);
      return;
    }
    setQuestionIndex((index) => getSessionQuestionIndex(index, 1, questions.length));
    setQuestionNumber((number) => number + 1);
    setSelected(null);
  }

  if (finished) {
    return (
      <View style={styles.victoryBox}>
        <CrushyMascot expression="amoureuse" size={110} interactive />
        <ChunkyCard tint={palette.pink} radius={designTokens.radius.xl} depth={4} style={styles.finishCard}>
          <View style={styles.finishCardInner}>
            <Text style={[styles.finishTitle, { color: palette.text }]}>Tous tes choix sont faits !</Text>
            <Text style={[styles.finishSubtitle, { color: palette.text }]}>
              Tes dilemmes révèlent ton style unique. Tu gagnes +15 XP bien mérités ! ✨
            </Text>
          </View>
        </ChunkyCard>
        <CrushyButton onPress={() => {
          setFinished(false);
          setQuestionIndex((index) => getSessionQuestionIndex(index, 1, questions.length));
          setQuestionNumber(1);
          setSelected(null);
        }}>
          Rejouer une série
        </CrushyButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.progress, { color: palette.subtle }]}>Dilemme {questionNumber} sur {WOULD_YOU_RATHER_QUESTION_COUNT}</Text>
      <Text style={[styles.prompt, { color: palette.text }]}>{question.prompt}</Text>
      {question.choices.map((choice, index) => {
        const isChosen = selected === index;
        return (
          <View key={choice} style={styles.choiceWrapper}>
            <GameOption onPress={() => selectOption(index)} selected={isChosen} disabled={selected !== null}>
              {choice}
            </GameOption>
          </View>
        );
      })}
      {contentError ? <Text style={[styles.contentError, { color: palette.subtle }]}>{contentError} Les questions intégrées restent disponibles.</Text> : null}
      {selected !== null ? (
        <>
          <GameFeedback success>{question.reactions[selected]}</GameFeedback>
          <CrushyButton onPress={continueGame}>
            {questionNumber === WOULD_YOU_RATHER_QUESTION_COUNT ? 'Voir mon résultat' : 'Question suivante'}
          </CrushyButton>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  progress: { fontSize: 12, fontFamily: designTokens.typography.bold },
  prompt: { fontSize: 20, fontFamily: designTokens.typography.extraBold, marginTop: 10, marginBottom: 4 },
  choiceWrapper: { marginBottom: 6 },
  contentError: { fontSize: 11, lineHeight: 16, marginTop: 8 },
  victoryBox: {
    alignItems: 'center',
    marginTop: 10,
  },
  finishCard: {
    width: '100%',
    marginTop: 14,
    marginBottom: 14,
  },
  finishCardInner: {
    padding: 18,
    alignItems: 'center',
  },
  finishTitle: {
    fontSize: 20,
    fontFamily: designTokens.typography.extraBold,
  },
  finishSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
