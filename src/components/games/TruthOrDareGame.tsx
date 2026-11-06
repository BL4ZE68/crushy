import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CrushyButton } from '../CrushyButton';
import { GameFeedback } from './GameFeedback';
import { GameOption } from './GameOption';
import { designTokens } from '../../theme/theme';
import { useCrushyStore } from '../../store/useCrushyStore';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { GamePrompt, getRandomPrompt, PromptCategory, PromptKind, promptCategories } from '../../games/gameData';
import { fetchPublishedGameQuestions } from '../../lib/publicContent';

export function TruthOrDareGame() {
  const { palette } = useCrushyTheme();
  const addXp = useCrushyStore((state) => state.addXp);
  const [category, setCategory] = useState<PromptCategory>('drôle');
  const [kind, setKind] = useState<PromptKind>('vérité');
  const [prompt, setPrompt] = useState<GamePrompt>(() => getRandomPrompt('drôle', 'vérité'));
  const [feedback, setFeedback] = useState('');
  const [customPrompts, setCustomPrompts] = useState<GamePrompt[]>([]);
  const [contentError, setContentError] = useState('');

  useEffect(() => {
    let active = true;
    void fetchPublishedGameQuestions('truth-or-dare')
      .then((questions) => {
        if (!active) return;
        const categoryBySlug: Record<string, PromptCategory> = {
          drole: 'drôle',
          personnel: 'personnel',
          amitie: 'amitié',
          crush: 'crush',
          insolite: 'insolite',
        };
        setCustomPrompts(questions
          .filter((question) => question.kind === 'truth' || question.kind === 'dare')
          .map((question) => ({
            id: question.id,
            category: question.category_slug ? categoryBySlug[question.category_slug] ?? 'personnel' : 'personnel',
            kind: question.kind === 'truth' ? 'vérité' : 'action',
            text: question.prompt,
          })));
      })
      .catch((error: unknown) => {
        if (active) setContentError(error instanceof Error ? error.message : 'Les questions personnalisées sont indisponibles.');
      });
    return () => {
      active = false;
    };
  }, []);

  function chooseCategory(next: PromptCategory) {
    setCategory(next);
    setFeedback('');
    setPrompt(getRandomPrompt(next, kind, prompt.id, Math.random, customPrompts));
  }

  function chooseKind(next: PromptKind) {
    setKind(next);
    setFeedback('');
    setPrompt(getRandomPrompt(category, next, undefined, Math.random, customPrompts));
  }

  function nextPrompt() {
    setFeedback('');
    setPrompt(getRandomPrompt(category, kind, prompt.id, Math.random, customPrompts));
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionLabel, { color: palette.text }]}>Choisis une catégorie</Text>
      <View style={styles.chips}>
        {promptCategories.map((item) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: category === item }}
            key={item}
            onPress={() => chooseCategory(item)}
            style={[styles.chip, { backgroundColor: category === item ? palette.text : palette.surfaceAlt }]}
          >
            <Text style={{ color: category === item ? palette.background : palette.text, fontSize: 12, fontFamily: designTokens.typography.bold, textTransform: 'capitalize' }}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.kindChoices}>
        {(['vérité', 'action'] as const).map((item) => (
          <GameOption key={item} onPress={() => chooseKind(item)} selected={kind === item} style={styles.kindOption}>
            {item === 'vérité' ? 'Vérité' : 'Action'}
          </GameOption>
        ))}
      </View>
      <View style={[styles.promptCard, { backgroundColor: palette.lavender }]}>
        <Text style={[styles.promptCategory, { color: palette.text }]}>{prompt.category.toUpperCase()} · {prompt.kind.toUpperCase()}</Text>
        <Text style={[styles.prompt, { color: palette.text }]}>{prompt.text}</Text>
      </View>
      {contentError ? <Text style={[styles.contentError, { color: palette.subtle }]}>{contentError} Les questions intégrées restent disponibles.</Text> : null}
      {feedback ? <GameFeedback success>{feedback}</GameFeedback> : null}
      <CrushyButton secondary onPress={nextPrompt}>Passer cette question</CrushyButton>
      <CrushyButton disabled={Boolean(feedback)} onPress={() => { addXp(5, 'Défi action ou vérité réussi'); setFeedback('Bravo, +5 XP pour ce petit défi !'); }}>
        {feedback ? 'Défi coché' : 'C’est fait, +5 XP'}
      </CrushyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 6 },
  sectionLabel: { fontSize: 14, fontFamily: designTokens.typography.bold, marginTop: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 8 },
  chip: { borderRadius: designTokens.radius.pill, paddingVertical: 8, paddingHorizontal: 11 },
  kindChoices: { flexDirection: 'row', gap: 9 },
  kindOption: { flex: 1, alignItems: 'center' },
  promptCard: { minHeight: 166, borderRadius: designTokens.radius.xl, padding: 20, justifyContent: 'center', marginTop: 16 },
  promptCategory: { fontSize: 10, letterSpacing: 1.1, fontFamily: designTokens.typography.bold, marginBottom: 10 },
  prompt: { fontSize: 20, lineHeight: 28, fontFamily: designTokens.typography.extraBold },
  contentError: { fontSize: 11, lineHeight: 16, marginTop: 8 },
});
