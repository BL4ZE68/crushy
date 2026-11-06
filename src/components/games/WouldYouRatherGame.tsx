import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CrushyButton } from '../CrushyButton';
import { GameFeedback } from './GameFeedback';
import { GameOption } from './GameOption';
import { designTokens } from '../../theme/theme';
import { useCrushyStore } from '../../store/useCrushyStore';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { ChoiceQuestion, wouldYouRatherQuestions } from '../../games/gameData';
import { fetchPublishedGameQuestions } from '../../lib/publicContent';

export function WouldYouRatherGame() {
  const { palette } = useCrushyTheme();
  const completeGame = useCrushyStore((state) => state.completeGame);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<ChoiceQuestion[]>([]);
  const [contentError, setContentError] = useState('');
  const questions = [...wouldYouRatherQuestions, ...customQuestions];
  const question = questions[questionIndex];

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
    setSelected(index);
  }

  function continueGame() {
    if (questionIndex === questions.length - 1) {
      completeGame('would-you-rather', 15);
      setFinished(true);
      return;
    }
    setQuestionIndex((index) => (index + 1) % questions.length);
    setSelected(null);
  }

  if (finished) {
    return (
      <View>
        <GameFeedback success>Ton choix en dit long… ou pas du tout ! Tu as gagné 15 XP. Le principal, c’est de t’être amusée.</GameFeedback>
        <CrushyButton onPress={() => { setFinished(false); setQuestionIndex(0); setSelected(null); }}>Rejouer</CrushyButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.progress, { color: palette.subtle }]}>Choix {questionIndex + 1} sur {questions.length}</Text>
      <Text style={[styles.prompt, { color: palette.text }]}>{question.prompt}</Text>
      {question.choices.map((choice, index) => (
        <GameOption key={choice} onPress={() => selectOption(index)} selected={selected === index} disabled={selected !== null}>
          {choice}
        </GameOption>
      ))}
      {contentError ? <Text style={[styles.contentError, { color: palette.subtle }]}>{contentError} Les questions intégrées restent disponibles.</Text> : null}
      {selected !== null ? (
        <>
          <GameFeedback success>{question.reactions[selected]}</GameFeedback>
          <CrushyButton onPress={continueGame}>
            {questionIndex === questions.length - 1 ? 'Voir mon résultat' : 'Question suivante'}
          </CrushyButton>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  progress: { fontSize: 12, fontFamily: designTokens.typography.bold },
  prompt: { fontSize: 20, fontFamily: designTokens.typography.extraBold, marginTop: 10 },
  contentError: { fontSize: 11, lineHeight: 16, marginTop: 8 },
});
