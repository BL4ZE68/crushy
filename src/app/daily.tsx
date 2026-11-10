import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { ChunkyCard } from '../components/ChunkySurface';
import { CrushyButton } from '../components/CrushyButton';
import { CrushyMascot } from '../components/CrushyMascot';
import { CrushyScreen, SectionHeading } from '../components/CrushyScreen';
import { CrushyStateMessage } from '../components/CrushyStateMessage';
import { getDailyContent } from '../daily/content';
import {
  fetchPublishedChallenge,
  fetchPublishedDailyItems,
  ManagedChallenge,
  ManagedDailyItem,
} from '../lib/publicContent';
import { moodMeta, moodOrder } from '../theme/moods';
import { designTokens } from '../theme/theme';
import { Mood, useCrushyStore } from '../store/useCrushyStore';
import { useCrushyTheme } from '../theme/useCrushyTheme';

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
  const hapticsEnabled = useCrushyStore((state) => state.hapticsEnabled);

  const [publishedItems, setPublishedItems] = useState<ManagedDailyItem[]>([]);
  const [publishedChallenge, setPublishedChallenge] = useState<ManagedChallenge | null>(null);
  const [contentError, setContentError] = useState('');
  const [loadingContent, setLoadingContent] = useState(true);

  const today = new Date();
  const dayKey = getDayKey(today);
  const dailyMood: Mood = mood ?? 'rêveuse';
  const content = getDailyContent(dailyMood, today);
  const challengeComplete = completedDailyChallenges.includes(dayKey);

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
    let active = true;
    setPublishedItems([]);
    setPublishedChallenge(null);
    setContentError('');
    setLoadingContent(true);
    void Promise.all([
      fetchPublishedDailyItems(dailyMood, dayKey),
      fetchPublishedChallenge(new Date().toISOString()),
    ])
      .then(([items, challenge]) => {
        if (!active) return;
        setPublishedItems(items);
        setPublishedChallenge(challenge);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.warn('Impossible de charger le contenu quotidien publié.', error);
        setContentError('Le contenu en ligne est indisponible. Tes contenus locaux restent prêts.');
      })
      .finally(() => {
        if (active) setLoadingContent(false);
      });
    return () => {
      active = false;
    };
  }, [dailyMood, dayKey]);

  const dailyValue = (type: ManagedDailyItem['content_type'], fallback: string) =>
    publishedItems.find((item) => item.content_type === type && item.mood === dailyMood)?.content ??
    publishedItems.find((item) => item.content_type === type && item.mood === null)?.content ??
    fallback;

  const challengeTitle = publishedChallenge?.title ?? 'Petit défi du jour';
  const challengeText = publishedChallenge?.description ?? content.challenge;
  const challengeXp = publishedChallenge?.xp_reward ?? 5;

  function handleCompleteChallenge() {
    triggerHaptic(40);
    completeDailyChallenge(dayKey, challengeXp, challengeTitle);
  }

  function handleSelectMood(selectedMood: Mood) {
    triggerHaptic();
    setMood(selectedMood);
  }

  const moodColor = mood ? moodMeta[mood].tint(palette) : palette.pink;

  return (
    <CrushyScreen
      eyebrow="UN PETIT RITUEL RIEN QU’À TOI"
      title="Ton rituel du jour"
      subtitle="Pas de bonne ou de mauvaise humeur. Prends un instant pour toi et laisse Pip t’accompagner."
    >
      {/* Date du jour */}
      <View style={[styles.dateBadge, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
        <Ionicons name="calendar-outline" size={14} color={palette.accent} />
        <Text style={[styles.dateText, { color: palette.text }]}>
          {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(today)}
        </Text>
      </View>

      {/* Carte Mascot avec humeur active */}
      <ChunkyCard tint={moodColor} radius={designTokens.radius.xl} depth={4} style={styles.mascotCardWrap}>
        <View style={styles.mascotCardInner}>
          <CrushyMascot expression={mood ?? 'heureuse'} size={98} interactive />
          <View style={styles.mascotCopy}>
            <Text style={[styles.mascotMoodTitle, { color: palette.text }]}>
              {mood ? `Humeur : ${mood}` : 'Dis-moi comment tu vas'}
            </Text>
            <Text style={[styles.mascotSpeech, { color: palette.text }]}>
              « {mood ? moodMeta[mood].line : 'Choisis une humeur pour adapter tes pensées du jour.'} »
            </Text>
          </View>
        </View>
      </ChunkyCard>

      {/* Sélecteur d'humeur en pilules */}
      <SectionHeading>Comment te sens-tu en ce moment ?</SectionHeading>
      <View style={styles.moodGrid}>
        {moodOrder.map((item) => {
          const isSelected = mood === item;
          const meta = moodMeta[item];
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={item}
              onPress={() => handleSelectMood(item)}
              style={[
                styles.moodChip,
                {
                  backgroundColor: isSelected ? meta.tint(palette) : palette.surface,
                  borderColor: isSelected ? palette.ink : palette.border,
                  borderWidth: isSelected ? 2.5 : 1.5,
                },
              ]}
            >
              <Text style={styles.moodEmoji}>{meta.emoji}</Text>
              <Text
                style={[
                  styles.moodChipText,
                  {
                    color: palette.text,
                    fontFamily: isSelected ? designTokens.typography.bold : designTokens.typography.regular,
                  },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {contentError ? (
        <CrushyStateMessage message={contentError} title="Contenus locaux disponibles" tone="warning" />
      ) : null}
      {loadingContent ? (
        <CrushyStateMessage message="On prépare tes petites pensées du jour." title="Un instant" tone="loading" />
      ) : null}

      {/* Cartes Chunky des contenus du jour */}
      <SectionHeading>Tes petits mots d’aujourd’hui</SectionHeading>
      <View style={styles.cardsList}>
        <DailyCard
          badge="INSPIRATION"
          body={dailyValue('quote', content.quote)}
          icon="sparkles"
          tint={palette.lavender}
          title="Citation du jour"
        />
        <DailyCard
          badge="SOURIRE"
          body={dailyValue('joke', content.joke)}
          icon="happy"
          tint={palette.yellow}
          title="Blague du jour"
        />
        <DailyCard
          badge="DOUCEUR"
          body={dailyValue('thought', content.thought)}
          icon="heart"
          tint={palette.pink}
          title="Une pensée pour toi"
        />
        <DailyCard
          badge="CURIOSITÉ"
          body={dailyValue('question', content.question)}
          icon="help-circle"
          tint={palette.mint}
          title="Question amusante"
        />
      </View>

      {/* Défi du jour */}
      <SectionHeading>Ton défi du jour</SectionHeading>
      <ChunkyCard
        depth={3}
        radius={designTokens.radius.xl}
        tint={challengeComplete ? palette.surfaceAlt : palette.surface}
        style={styles.challengeWrap}
      >
        <View style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <View style={[styles.challengeIconBox, { backgroundColor: palette.peach, borderColor: palette.ink }]}>
              <Ionicons
                color={palette.ink}
                name={challengeComplete ? 'checkmark-circle' : 'flash'}
                size={22}
              />
            </View>
            <View style={styles.challengeHeaderCopy}>
              <Text style={[styles.challengeTitle, { color: palette.text }]}>{challengeTitle}</Text>
              <Text style={[styles.challengeXpBadge, { color: palette.accent }]}>+{challengeXp} XP à remporter</Text>
            </View>
          </View>
          <Text style={[styles.challengeBody, { color: palette.text }]}>{challengeText}</Text>
          <CrushyButton disabled={challengeComplete} onPress={handleCompleteChallenge}>
            {challengeComplete ? `Défi validé · +${challengeXp} XP gagnés ! ✨` : `Valider mon défi · +${challengeXp} XP`}
          </CrushyButton>
        </View>
      </ChunkyCard>

      <View style={styles.footerSpacing} />
    </CrushyScreen>
  );
}

function DailyCard({
  badge,
  title,
  body,
  tint,
  icon,
}: {
  badge: string;
  title: string;
  body: string;
  tint: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const { palette } = useCrushyTheme();
  return (
    <ChunkyCard depth={3} radius={designTokens.radius.lg} tint={tint} style={styles.dailyCardWrap}>
      <View style={styles.dailyCardInner}>
        <View style={styles.dailyCardTop}>
          <View style={[styles.cardBadge, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
            <Ionicons name={icon} size={13} color={palette.accent} />
            <Text style={[styles.cardBadgeText, { color: palette.accent }]}>{badge}</Text>
          </View>
          <Text style={[styles.dailyCardTitle, { color: palette.text }]}>{title}</Text>
        </View>
        <Text style={[styles.dailyCardBody, { color: palette.text }]}>{body}</Text>
      </View>
    </ChunkyCard>
  );
}

const styles = StyleSheet.create({
  dateBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
    marginTop: 2,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    textTransform: 'capitalize',
    fontFamily: designTokens.typography.bold,
  },
  mascotCardWrap: {
    marginTop: 4,
    marginBottom: 8,
  },
  mascotCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  mascotCopy: {
    flex: 1,
  },
  mascotMoodTitle: {
    fontSize: 18,
    fontFamily: designTokens.typography.extraBold,
    textTransform: 'capitalize',
  },
  mascotSpeech: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    fontFamily: designTokens.typography.regular,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: -4,
  },
  moodChip: {
    flexBasis: '31%',
    flexGrow: 1,
    minHeight: 46,
    borderRadius: designTokens.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 6,
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodChipText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  cardsList: {
    gap: 12,
  },
  dailyCardWrap: {
    marginBottom: 2,
  },
  dailyCardInner: {
    padding: 18,
  },
  dailyCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
  },
  cardBadgeText: {
    fontSize: 9,
    fontFamily: designTokens.typography.extraBold,
  },
  dailyCardTitle: {
    fontSize: 14,
    fontFamily: designTokens.typography.bold,
  },
  dailyCardBody: {
    fontSize: 15,
    lineHeight: 23,
    fontFamily: designTokens.typography.regular,
  },
  challengeWrap: {
    marginTop: 4,
  },
  challengeCard: {
    padding: 18,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  challengeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeHeaderCopy: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontFamily: designTokens.typography.extraBold,
  },
  challengeXpBadge: {
    fontSize: 12,
    fontFamily: designTokens.typography.bold,
    marginTop: 2,
  },
  challengeBody: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  footerSpacing: {
    height: 32,
  },
});
