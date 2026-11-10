import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, useReducedMotion } from 'react-native-reanimated';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChunkyCard } from '../components/ChunkySurface';
import { CrushyMascot } from '../components/CrushyMascot';
import { CrushyScreen, SectionHeading } from '../components/CrushyScreen';
import { CrushyStateMessage } from '../components/CrushyStateMessage';
import { Achievement, achievements } from '../rewards/achievements';
import { designTokens } from '../theme/theme';
import { ActivityKind, UserActivity, useCrushyStore } from '../store/useCrushyStore';
import { useCrushyTheme } from '../theme/useCrushyTheme';

function formatActivityDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Récemment';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function getLevelRank(level: number): string {
  if (level >= 10) return 'Légende de douceur 👑';
  if (level >= 7) return 'Cœur étincelant ✨';
  if (level >= 5) return 'Explorateur d’étoiles 🚀';
  if (level >= 3) return 'Semeur de sourires 🌸';
  if (level >= 2) return 'Ami fidèle 💛';
  return 'Curieux en herbe 🌱';
}

export default function RewardsScreen() {
  const xp = useCrushyStore((state) => state.xp);
  const activities = useCrushyStore((state) => state.activities);
  const unlockedIds = useCrushyStore((state) => state.unlockedAchievements);
  const { palette } = useCrushyTheme();
  const reduceMotion = useReducedMotion();

  const [activityFilter, setActivityFilter] = useState<'all' | 'game' | 'badge' | 'surprise'>('all');

  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;
  const openedCount = useCrushyStore((state) => state.openedSurpriseIds.length);
  const completedGames = Object.values(useCrushyStore((state) => state.gameCompletions)).reduce(
    (total, count) => total + count,
    0,
  );

  const filteredActivities = activities.filter((act) => {
    if (activityFilter === 'all') return true;
    if (activityFilter === 'game') return act.kind === 'game';
    if (activityFilter === 'badge') return act.kind === 'achievement';
    if (activityFilter === 'surprise') return act.kind === 'surprise';
    return true;
  });

  return (
    <CrushyScreen
      eyebrow="CHAQUE PETIT MOMENT COMPTE"
      title="Tes récompenses"
      subtitle="Des points et des trophées pour célébrer tes moments de pause, sans aucune pression."
    >
      {/* Niveau & Jauge d'XP */}
      <ChunkyCard tint={palette.lavender} radius={designTokens.radius.xl} depth={4} style={styles.levelWrap}>
        <View style={styles.levelCard}>
          <View style={styles.levelCardTop}>
            <View>
              <View style={[styles.rankPill, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
                <Text style={[styles.rankPillText, { color: palette.accent }]}>{getLevelRank(level)}</Text>
              </View>
              <Text style={[styles.levelLabel, { color: palette.text }]}>NIVEAU {level}</Text>
              <Text style={[styles.xp, { color: palette.text }]}>{xp} XP</Text>
            </View>
            <CrushyMascot expression="amoureuse" size={82} interactive />
          </View>

          <Text style={[styles.levelHint, { color: palette.text }]}>
            Encore {100 - progress} XP pour atteindre le niveau {level + 1} ! ✨
          </Text>
          <View
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: progress }}
            style={[styles.track, { backgroundColor: palette.surface, borderColor: palette.ink }]}
          >
            <View style={[styles.progress, { backgroundColor: palette.accent, width: `${Math.max(progress, 6)}%` }]} />
          </View>
        </View>
      </ChunkyCard>

      {/* Cartes de compteurs de victoires */}
      <View style={styles.stats}>
        <Stat icon="game-controller" label="Jeux terminés" value={`${completedGames}`} />
        <Stat icon="mail-open" label="Surprises lues" value={`${openedCount}`} />
        <Stat icon="ribbon" label="Badges obtenus" value={`${unlockedIds.length}/${achievements.length}`} />
      </View>

      {/* Badges & Succès */}
      <SectionHeading>Badges & trophées</SectionHeading>
      <View style={styles.badgeList}>
        {achievements.map((achievement, index) => {
          const unlocked = unlockedIds.includes(achievement.id);
          const hidden = Boolean(achievement.hidden && !unlocked);
          return (
            <AchievementCard
              achievement={achievement}
              hidden={hidden}
              index={index}
              key={achievement.id}
              reduceMotion={reduceMotion}
              unlocked={unlocked}
            />
          );
        })}
      </View>

      {/* Historique avec filtres */}
      <SectionHeading>Ton historique d’activité</SectionHeading>
      <View style={styles.activityFilterRow}>
        {(
          [
            { id: 'all', label: 'Tout' },
            { id: 'game', label: 'Jeux' },
            { id: 'badge', label: 'Badges' },
            { id: 'surprise', label: 'Surprises' },
          ] as const
        ).map((tab) => {
          const isSelected = activityFilter === tab.id;
          return (
            <Pressable
              accessibilityRole="button"
              key={tab.id}
              onPress={() => setActivityFilter(tab.id)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isSelected ? palette.text : palette.surface,
                  borderColor: isSelected ? palette.ink : palette.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: isSelected ? palette.background : palette.text,
                    fontFamily: isSelected ? designTokens.typography.bold : designTokens.typography.regular,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filteredActivities.length ? (
        <ChunkyCard radius={designTokens.radius.lg} tint={palette.surface} depth={3} style={styles.historyCardWrap}>
          <View style={styles.historyInner}>
            {filteredActivities.slice(0, 20).map((activity, idx) => (
              <ActivityRow
                activity={activity}
                isLast={idx === Math.min(filteredActivities.length, 20) - 1}
                key={activity.id}
              />
            ))}
          </View>
        </ChunkyCard>
      ) : (
        <CrushyStateMessage message="Tes parties et petites victoires apparaîtront ici." title="Rien pour l'instant" />
      )}

      <View style={styles.footerSpace} />
    </CrushyScreen>
  );
}

function AchievementCard({
  achievement,
  hidden,
  index,
  reduceMotion,
  unlocked,
}: {
  achievement: Achievement;
  hidden: boolean;
  index: number;
  reduceMotion: boolean;
  unlocked: boolean;
}) {
  const { palette } = useCrushyTheme();
  return (
    <Animated.View
      entering={unlocked && !reduceMotion ? FadeInUp.duration(220).delay(Math.min(index * 45, 180)) : undefined}
    >
      <ChunkyCard
        depth={unlocked ? 3 : 0}
        outlineWidth={unlocked ? 2.5 : 1}
        radius={designTokens.radius.lg}
        style={styles.badgeWrap}
        tint={unlocked ? palette.surface : palette.surfaceAlt}
      >
        <View style={styles.badge}>
          <View
            style={[
              styles.badgeSeal,
              {
                backgroundColor: unlocked ? palette.pink : palette.border,
                borderColor: palette.ink,
                borderWidth: unlocked ? 2 : 1,
              },
            ]}
          >
            <Ionicons
              color={palette.ink}
              name={hidden ? 'lock-closed' : unlocked ? 'ribbon' : 'sparkles'}
              size={20}
            />
          </View>
          <View style={styles.badgeCopy}>
            <Text style={[styles.badgeTitle, { color: palette.text }]}>{hidden ? '???' : achievement.title}</Text>
            <Text style={[styles.badgeDetail, { color: palette.subtle }]}>
              {hidden ? 'Une récompense secrète se cache dans les mini-jeux.' : achievement.description}
            </Text>
          </View>
          <View
            style={[
              styles.badgeStatusPill,
              {
                backgroundColor: unlocked ? palette.mint : palette.surface,
                borderColor: palette.ink,
              },
            ]}
          >
            <Text style={[styles.badgeStatus, { color: palette.ink }]}>{unlocked ? 'Obtenu ✨' : 'À venir'}</Text>
          </View>
        </View>
      </ChunkyCard>
    </Animated.View>
  );
}

function ActivityRow({ activity, isLast }: { activity: UserActivity; isLast: boolean }) {
  const { palette } = useCrushyTheme();
  const icons: Record<ActivityKind, keyof typeof Ionicons.glyphMap> = {
    game: 'game-controller-outline',
    surprise: 'mail-open-outline',
    achievement: 'ribbon-outline',
    mood: 'happy-outline',
    schedule: 'time-outline',
    challenge: 'flash-outline',
    daily: 'sunny-outline',
  };

  return (
    <View style={[styles.activity, !isLast && { borderBottomColor: palette.border, borderBottomWidth: 1 }]}>
      <View style={[styles.activityIconCircle, { backgroundColor: palette.surfaceAlt }]}>
        <Ionicons color={palette.accent} name={icons[activity.kind] ?? 'star-outline'} size={16} />
      </View>
      <View style={styles.activityCopy}>
        <Text style={[styles.activityTitle, { color: palette.text }]}>{activity.title}</Text>
        <Text style={[styles.activityDate, { color: palette.subtle }]}>{formatActivityDate(activity.createdAt)}</Text>
      </View>
      {activity.xp > 0 ? (
        <View style={[styles.xpPill, { backgroundColor: palette.yellow, borderColor: palette.ink }]}>
          <Text style={[styles.activityXp, { color: palette.ink }]}>+{activity.xp} XP</Text>
        </View>
      ) : null}
    </View>
  );
}

function Stat({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  const { palette } = useCrushyTheme();
  return (
    <ChunkyCard depth={3} radius={designTokens.radius.lg} style={styles.statWrap}>
      <View style={styles.stat}>
        <Ionicons name={icon} size={18} color={palette.accent} />
        <Text style={[styles.statValue, { color: palette.text }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: palette.subtle }]}>{label}</Text>
      </View>
    </ChunkyCard>
  );
}

const styles = StyleSheet.create({
  levelWrap: { marginTop: 14 },
  levelCard: { padding: 18 },
  levelCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
    marginBottom: 6,
  },
  rankPillText: {
    fontSize: 10,
    fontFamily: designTokens.typography.bold,
  },
  levelLabel: { fontSize: 11, letterSpacing: 1.2, fontFamily: designTokens.typography.bold },
  xp: { fontSize: 32, fontFamily: designTokens.typography.extraBold, marginTop: 2 },
  levelHint: { fontSize: 12, marginTop: 10, opacity: 0.9 },
  track: { height: 12, borderRadius: 6, marginTop: 10, overflow: 'hidden', borderWidth: 2 },
  progress: { height: '100%', borderRadius: 6 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 14 },
  statWrap: { flex: 1 },
  stat: { alignItems: 'center', paddingVertical: 12, gap: 2 },
  statValue: { fontSize: 18, fontFamily: designTokens.typography.extraBold, marginTop: 2 },
  statLabel: { fontSize: 10, textAlign: 'center' },
  badgeList: { gap: 8 },
  badgeWrap: { marginBottom: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  badgeSeal: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  badgeCopy: { flex: 1, marginLeft: 12, paddingRight: 6 },
  badgeTitle: { fontSize: 14, fontFamily: designTokens.typography.bold },
  badgeDetail: { fontSize: 11, lineHeight: 16, marginTop: 3 },
  badgeStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
  },
  badgeStatus: { fontSize: 10, fontFamily: designTokens.typography.bold },
  activityFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: -4,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
  },
  filterChipText: {
    fontSize: 11,
  },
  historyCardWrap: {
    marginTop: 4,
  },
  historyInner: {
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  activity: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  activityIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityCopy: { flex: 1 },
  activityTitle: { fontSize: 13, fontFamily: designTokens.typography.bold },
  activityDate: { fontSize: 11, marginTop: 2 },
  xpPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
  },
  activityXp: { fontSize: 10, fontFamily: designTokens.typography.bold },
  footerSpace: { height: 32 },
});
