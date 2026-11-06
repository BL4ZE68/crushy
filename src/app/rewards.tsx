import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, useReducedMotion } from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';
import { CrushyScreen, SectionHeading } from '../components/CrushyScreen';
import { CrushyStateMessage } from '../components/CrushyStateMessage';
import { Achievement, achievements } from '../rewards/achievements';
import { designTokens } from '../theme/theme';
import { UserActivity, useCrushyStore } from '../store/useCrushyStore';
import { useCrushyTheme } from '../theme/useCrushyTheme';

function formatActivityDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Récemment';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function RewardsScreen() {
  const xp = useCrushyStore((state) => state.xp);
  const activities = useCrushyStore((state) => state.activities);
  const unlockedIds = useCrushyStore((state) => state.unlockedAchievements);
  const { palette } = useCrushyTheme();
  const reduceMotion = useReducedMotion();
  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;
  const openedCount = useCrushyStore((state) => state.openedSurpriseIds.length);
  const completedGames = Object.values(useCrushyStore((state) => state.gameCompletions))
    .reduce((total, count) => total + count, 0);

  return (
    <CrushyScreen eyebrow="CHAQUE PETIT MOMENT COMPTE" title="Tes récompenses" subtitle="Des points pour célébrer tes découvertes, sans pression.">
      <View style={[styles.levelCard, { backgroundColor: palette.lavender }]}>
        <Text style={[styles.levelLabel, { color: palette.text }]}>NIVEAU {level}</Text>
        <Text style={[styles.xp, { color: palette.text }]}>{xp} XP</Text>
        <Text style={[styles.levelHint, { color: palette.text }]}>{100 - progress} XP avant le niveau {level + 1}</Text>
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: progress }}
          style={[styles.track, { backgroundColor: palette.surface }]}
        >
          <View style={[styles.progress, { backgroundColor: palette.accent, width: `${progress}%` }]} />
        </View>
      </View>
      <View style={styles.stats}>
        <Stat value={`${completedGames}`} label="Jeux terminés" />
        <Stat value={`${openedCount}`} label="Surprises lues" />
      </View>
      <SectionHeading>Badges & succès</SectionHeading>
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
      <SectionHeading>Ton historique</SectionHeading>
      {activities.length ? (
        activities.slice(0, 20).map((activity) => (
          <ActivityRow activity={activity} key={activity.id} />
        ))
      ) : (
        <CrushyStateMessage message="Tes parties et petites victoires apparaîtront ici." title="Ton aventure commence" />
      )}
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
      style={[styles.badge, { backgroundColor: palette.surface, borderColor: unlocked ? palette.pink : palette.border }]}
    >
      <View style={[styles.badgeSeal, { backgroundColor: unlocked ? palette.pink : palette.surfaceAlt }]}>
        <Ionicons name={hidden ? 'lock-closed' : unlocked ? 'ribbon' : 'sparkles'} size={19} color={unlocked ? palette.text : palette.accent} />
      </View>
      <View style={styles.badgeCopy}>
        <Text style={[styles.badgeTitle, { color: palette.text }]}>{hidden ? '???' : achievement.title}</Text>
        <Text style={[styles.badgeDetail, { color: palette.subtle }]}>
          {hidden ? 'Une récompense secrète se cache dans les mini-jeux.' : achievement.description}
        </Text>
      </View>
      <Text style={[styles.badgeStatus, { color: unlocked ? palette.accent : palette.subtle }]}>{unlocked ? 'Obtenu' : 'À venir'}</Text>
    </Animated.View>
  );
}

function ActivityRow({ activity }: { activity: UserActivity }) {
  const { palette } = useCrushyTheme();
  const icons = {
    game: 'game-controller-outline',
    surprise: 'mail-open-outline',
    achievement: 'ribbon-outline',
    mood: 'happy-outline',
    schedule: 'time-outline',
    challenge: 'flash-outline',
    daily: 'sunny-outline',
  } as const;

  return (
    <View style={[styles.activity, { borderBottomColor: palette.border }]}>
      <Ionicons name={icons[activity.kind]} size={18} color={palette.accent} />
      <View style={styles.activityCopy}>
        <Text style={[styles.activityTitle, { color: palette.text }]}>{activity.title}</Text>
        <Text style={[styles.activityDate, { color: palette.subtle }]}>{formatActivityDate(activity.createdAt)}</Text>
      </View>
      {activity.xp > 0 ? <Text style={[styles.activityXp, { color: palette.accent }]}>+{activity.xp} XP</Text> : null}
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  const { palette } = useCrushyTheme();
  return (
    <View style={[styles.stat, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <Text style={[styles.statValue, { color: palette.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: palette.subtle }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  levelCard: { borderRadius: designTokens.radius.xl, padding: 20, marginTop: 18 },
  levelLabel: { fontSize: 11, letterSpacing: 1.2, fontFamily: designTokens.typography.bold },
  xp: { fontSize: 34, fontFamily: designTokens.typography.extraBold, marginTop: 5 },
  levelHint: { fontSize: 12, marginTop: 2, opacity: 0.8 },
  track: { height: 8, borderRadius: 4, marginTop: 17, overflow: 'hidden' },
  progress: { height: 8, borderRadius: 4 },
  stats: { flexDirection: 'row', gap: 9, marginTop: 12 },
  stat: { flex: 1, alignItems: 'center', borderWidth: 1, borderRadius: 17, paddingVertical: 13 },
  statValue: { fontSize: 19, fontFamily: designTokens.typography.extraBold },
  statLabel: { fontSize: 10, marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: designTokens.radius.lg, padding: 12, marginBottom: 9 },
  badgeSeal: { width: 40, height: 40, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  badgeCopy: { flex: 1, marginLeft: 10 },
  badgeTitle: { fontSize: 13, fontFamily: designTokens.typography.bold },
  badgeDetail: { fontSize: 11, lineHeight: 16, marginTop: 3 },
  badgeStatus: { fontSize: 10, fontFamily: designTokens.typography.bold, marginLeft: 5 },
  activity: { minHeight: 58, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 9, gap: 10 },
  activityCopy: { flex: 1 },
  activityTitle: { fontSize: 12, fontFamily: designTokens.typography.bold },
  activityDate: { fontSize: 10, marginTop: 3 },
  activityXp: { fontSize: 10, fontFamily: designTokens.typography.bold },
});
