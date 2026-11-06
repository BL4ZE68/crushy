import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CrushyButton } from '../components/CrushyButton';
import { CrushyScreen, SectionHeading } from '../components/CrushyScreen';
import { CrushyStateMessage } from '../components/CrushyStateMessage';
import { getDailyContent } from '../daily/content';
import {
  fetchPublishedChallenge,
  fetchPublishedDailyItems,
  ManagedChallenge,
  ManagedDailyItem,
} from '../lib/publicContent';
import { designTokens } from '../theme/theme';
import { Mood, useCrushyStore } from '../store/useCrushyStore';
import { useCrushyTheme } from '../theme/useCrushyTheme';

const moods: Mood[] = ['heureuse', 'triste', 'amoureuse', 'énergique', 'fatiguée', 'rêveuse'];

function getDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export default function DailyScreen() {
  const { palette } = useCrushyTheme();
  const mood = useCrushyStore((state) => state.mood);
  const setMood = useCrushyStore((state) => state.setMood);
  const completedDailyChallenges = useCrushyStore((state) => state.completedDailyChallenges);
  const completeDailyChallenge = useCrushyStore((state) => state.completeDailyChallenge);
  const [publishedItems, setPublishedItems] = useState<ManagedDailyItem[]>([]);
  const [publishedChallenge, setPublishedChallenge] = useState<ManagedChallenge | null>(null);
  const [contentError, setContentError] = useState('');
  const [loadingContent, setLoadingContent] = useState(true);
  const today = new Date();
  const dayKey = getDayKey(today);
  const dailyMood = mood ?? 'rêveuse';
  const content = getDailyContent(dailyMood, today);
  const challengeComplete = completedDailyChallenges.includes(dayKey);

  useEffect(() => {
    let active = true;
    setPublishedItems([]);
    setPublishedChallenge(null);
    setContentError('');
    setLoadingContent(true);
    void Promise.all([
      fetchPublishedDailyItems(dailyMood, dayKey),
      fetchPublishedChallenge(new Date().toISOString()),
    ]).then(([items, challenge]) => {
      if (!active) return;
      setPublishedItems(items);
      setPublishedChallenge(challenge);
    }).catch((error: unknown) => {
      if (!active) return;
      console.warn('Impossible de charger le contenu quotidien publié.', error);
      setContentError('Le contenu en ligne est indisponible. Tes contenus locaux restent prêts.');
    }).finally(() => {
      if (active) setLoadingContent(false);
    });
    return () => {
      active = false;
    };
  }, [dailyMood, dayKey]);

  const dailyValue = (type: ManagedDailyItem['content_type'], fallback: string) =>
    publishedItems.find((item) => item.content_type === type && item.mood === dailyMood)?.content
      ?? publishedItems.find((item) => item.content_type === type && item.mood === null)?.content
      ?? fallback;
  const challengeTitle = publishedChallenge?.title ?? 'Petit défi du jour';
  const challengeText = publishedChallenge?.description ?? content.challenge;
  const challengeXp = publishedChallenge?.xp_reward ?? 5;

  return (
    <CrushyScreen eyebrow="UN PETIT RITUEL RIEN QU’À TOI" title="Ton humeur du jour" subtitle="Pas de bonne ou de mauvaise humeur. Juste la tienne.">
      <Text style={[styles.date, { color: palette.subtle }]}>
        {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(today)}
      </Text>
      <SectionHeading>Comment tu te sens ?</SectionHeading>
      <View style={styles.moods}>
        {moods.map((item) => {
          const selected = mood === item;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={item}
              onPress={() => setMood(item)}
              style={[styles.chip, { backgroundColor: selected ? palette.text : palette.surfaceAlt }]}
            >
              <Text style={[styles.chipText, { color: selected ? palette.background : palette.text }]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
      {!mood ? <Text style={[styles.helper, { color: palette.subtle }]}>Choisis une humeur pour personnaliser ta sélection du jour.</Text> : null}
      {contentError ? <CrushyStateMessage message={contentError} title="Contenus locaux disponibles" tone="warning" /> : null}
      {loadingContent ? <CrushyStateMessage message="On vérifie s’il y a une nouvelle surprise du jour." title="Un instant" tone="loading" /> : null}
      <DailyCard title="Citation du jour" body={dailyValue('quote', content.quote)} tint={palette.lavender} />
      <DailyCard title="Blague du jour" body={dailyValue('joke', content.joke)} tint={palette.yellow} />
      <DailyCard title="Une pensée pour toi" body={dailyValue('thought', content.thought)} tint={palette.pink} />
      <DailyCard title="Question amusante" body={dailyValue('question', content.question)} tint={palette.surfaceAlt} />
      <View style={[styles.challengeCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.cardTitle, { color: palette.text }]}>{challengeTitle}</Text>
        <Text style={[styles.cardBody, { color: palette.subtle }]}>{challengeText}</Text>
        <CrushyButton disabled={challengeComplete} onPress={() => completeDailyChallenge(dayKey, challengeXp, challengeTitle)}>
          {challengeComplete ? `Défi réussi · +${challengeXp} XP` : `C’est fait · +${challengeXp} XP`}
        </CrushyButton>
      </View>
    </CrushyScreen>
  );
}

function DailyCard({ title, body, tint }: { title: string; body: string; tint: string }) {
  const { palette } = useCrushyTheme();
  return (
    <View style={[styles.card, { backgroundColor: tint }]}>
      <Text style={[styles.cardTitle, { color: palette.text }]}>{title}</Text>
      <Text style={[styles.cardBody, { color: palette.text }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  date: { fontSize: 12, marginTop: 4, textTransform: 'capitalize' },
  moods: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: designTokens.radius.pill },
  chipText: { fontSize: 12, textTransform: 'capitalize', fontFamily: designTokens.typography.bold },
  helper: { fontSize: 12, lineHeight: 18, marginTop: 2 },
  card: { padding: 18, borderRadius: designTokens.radius.lg, marginTop: 12 },
  challengeCard: { padding: 17, borderRadius: designTokens.radius.lg, borderWidth: 1, marginTop: 12 },
  cardTitle: { fontSize: 14, fontFamily: designTokens.typography.bold },
  cardBody: { fontSize: 14, lineHeight: 21, marginTop: 7 },
});
