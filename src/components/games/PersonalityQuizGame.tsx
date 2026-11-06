import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CrushyButton } from '../CrushyButton';
import { GameFeedback } from './GameFeedback';
import { GameOption } from './GameOption';
import { designTokens } from '../../theme/theme';
import { useCrushyStore } from '../../store/useCrushyStore';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { getPersonalityOutcome, personalityProfiles, personalityQuestions, PersonalityType } from '../../games/gameData';

export function PersonalityQuizGame() {
  const { palette } = useCrushyTheme();
  const completeGame = useCrushyStore((state) => state.completeGame);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<PersonalityType[]>([]);
  const [selected, setSelected] = useState<PersonalityType | null>(null);
  const [resultType, setResultType] = useState<PersonalityType | null>(null);
  const question = personalityQuestions[questionIndex];

  function continueQuiz() {
    if (!selected) return;
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);
    setSelected(null);

    if (questionIndex === personalityQuestions.length - 1) {
      setResultType(getPersonalityOutcome(nextAnswers));
      completeGame('personality-quiz', 20);
      return;
    }
    setQuestionIndex((index) => index + 1);
  }

  if (resultType) {
    const result = personalityProfiles[resultType];
    return (
      <View style={[styles.result, { backgroundColor: palette.pink }]}>
        <Text style={[styles.resultEyebrow, { color: palette.text }]}>TON RÉSULTAT · +20 XP</Text>
        <Text style={[styles.resultTitle, { color: palette.text }]}>{result.title}</Text>
        <Text style={[styles.resultDescription, { color: palette.text }]}>{result.description}</Text>
        <CrushyButton onPress={() => { setQuestionIndex(0); setAnswers([]); setSelected(null); setResultType(null); }}>Refaire le quiz</CrushyButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.progress, { color: palette.subtle }]}>Question {questionIndex + 1} sur {personalityQuestions.length}</Text>
      <Text style={[styles.prompt, { color: palette.text }]}>{question.prompt}</Text>
      {question.choices.map((choice) => (
        <GameOption
          key={choice.type + choice.text}
          onPress={() => setSelected(choice.type)}
          selected={selected === choice.type}
        >
          {choice.text}
        </GameOption>
      ))}
      <CrushyButton disabled={!selected} onPress={continueQuiz}>
        {questionIndex === personalityQuestions.length - 1 ? 'Découvrir mon résultat' : 'Continuer'}
      </CrushyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  progress: { fontSize: 12, fontFamily: designTokens.typography.bold },
  prompt: { fontSize: 19, lineHeight: 25, fontFamily: designTokens.typography.extraBold, marginTop: 10, marginBottom: 3 },
  result: { borderRadius: designTokens.radius.xl, padding: 20, marginTop: 16 },
  resultEyebrow: { fontSize: 10, letterSpacing: 1.1, fontFamily: designTokens.typography.bold },
  resultTitle: { fontSize: 24, lineHeight: 30, fontFamily: designTokens.typography.extraBold, marginTop: 10 },
  resultDescription: { fontSize: 14, lineHeight: 21, marginTop: 6 },
});
