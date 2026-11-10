import { useState } from 'react';
import { StyleSheet, Text, Vibration, View } from 'react-native';
import { ChunkyCard } from '../ChunkySurface';
import { CrushyButton } from '../CrushyButton';
import { CrushyMascot } from '../CrushyMascot';
import { GameOption } from './GameOption';
import { designTokens } from '../../theme/theme';
import { useCrushyStore } from '../../store/useCrushyStore';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import {
  getDailyIndex,
  getPersonalityOutcome,
  getSessionQuestionIndex,
  PERSONALITY_QUESTION_COUNT,
  personalityProfiles,
  personalityQuestions,
  PersonalityType,
} from '../../games/gameData';
import { PipExpression } from '../pip/faces';

const profileExpressions: Record<PersonalityType, PipExpression> = {
  rayon: 'heureuse',
  reveuse: 'rêveuse',
  etincelle: 'énergique',
  coeur: 'amoureuse',
};

export function PersonalityQuizGame() {
  const { palette } = useCrushyTheme();
  const completeGame = useCrushyStore((state) => state.completeGame);
  const hapticsEnabled = useCrushyStore((state) => state.hapticsEnabled);
  const [startIndex, setStartIndex] = useState(() => getDailyIndex(personalityQuestions.length, new Date(), 37));
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answers, setAnswers] = useState<PersonalityType[]>([]);
  const [selected, setSelected] = useState<PersonalityType | null>(null);
  const [resultType, setResultType] = useState<PersonalityType | null>(null);
  const questionIndex = getSessionQuestionIndex(startIndex, questionNumber - 1, personalityQuestions.length);
  const question = personalityQuestions[questionIndex];

  function triggerHaptic() {
    if (hapticsEnabled) {
      try {
        Vibration.vibrate(20);
      } catch {
        // Ignoré
      }
    }
  }

  function handleSelect(type: PersonalityType) {
    triggerHaptic();
    setSelected(type);
  }

  function continueQuiz() {
    if (!selected) return;
    triggerHaptic();
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);
    setSelected(null);

    if (questionNumber === PERSONALITY_QUESTION_COUNT) {
      setResultType(getPersonalityOutcome(nextAnswers));
      completeGame('personality-quiz', 20);
      return;
    }
    setQuestionNumber((number) => number + 1);
  }

  if (resultType) {
    const result = personalityProfiles[resultType];
    const mascotExpression = profileExpressions[resultType] ?? 'heureuse';

    return (
      <View style={styles.resultContainer}>
        <CrushyMascot expression={mascotExpression} size={124} interactive />
        <ChunkyCard tint={palette.pink} radius={designTokens.radius.xl} depth={4} style={styles.resultCardWrap}>
          <View style={styles.resultCard}>
            <View style={[styles.resultBadge, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
              <Text style={[styles.resultBadgeText, { color: palette.accent }]}>PORTRAIT RÉVÉLÉ · +20 XP</Text>
            </View>
            <Text style={[styles.resultTitle, { color: palette.text }]}>{result.title}</Text>
            <Text style={[styles.resultDescription, { color: palette.text }]}>{result.description}</Text>
          </View>
        </ChunkyCard>
        <CrushyButton onPress={() => {
          setStartIndex((index) => getSessionQuestionIndex(index, PERSONALITY_QUESTION_COUNT, personalityQuestions.length));
          setQuestionNumber(1);
          setAnswers([]);
          setSelected(null);
          setResultType(null);
        }}>
          Refaire le quiz
        </CrushyButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.progress, { color: palette.subtle }]}>Question {questionNumber} sur {PERSONALITY_QUESTION_COUNT}</Text>
      <Text style={[styles.prompt, { color: palette.text }]}>{question.prompt}</Text>
      {question.choices.map((choice) => (
        <GameOption
          key={choice.type + choice.text}
          onPress={() => handleSelect(choice.type)}
          selected={selected === choice.type}
        >
          {choice.text}
        </GameOption>
      ))}
      <CrushyButton disabled={!selected} onPress={continueQuiz}>
        {questionNumber === PERSONALITY_QUESTION_COUNT ? 'Découvrir mon résultat' : 'Continuer'}
      </CrushyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  progress: { fontSize: 12, fontFamily: designTokens.typography.bold },
  prompt: { fontSize: 19, lineHeight: 25, fontFamily: designTokens.typography.extraBold, marginTop: 10, marginBottom: 3 },
  resultContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  resultCardWrap: {
    width: '100%',
    marginTop: 16,
    marginBottom: 14,
  },
  resultCard: {
    padding: 20,
    alignItems: 'center',
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  resultBadgeText: {
    fontSize: 11,
    fontFamily: designTokens.typography.bold,
  },
  resultTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: designTokens.typography.extraBold,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
});
