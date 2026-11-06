import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, useReducedMotion } from 'react-native-reanimated';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CrushyButton } from '../../components/CrushyButton';
import { CrushyScreen, SectionHeading } from '../../components/CrushyScreen';
import { CrushyStateMessage } from '../../components/CrushyStateMessage';
import {
  cancelSurpriseNotification,
  scheduleSurpriseNotification,
} from '../../lib/notifications';
import { fetchPublishedSurprises, ManagedSurprise } from '../../lib/publicContent';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { useCrushyStore } from '../../store/useCrushyStore';

type SurpriseKind = 'secret' | 'compliment' | 'quote' | 'letter' | 'joke';
type SurpriseStatus = 'unread' | 'read' | 'locked' | 'scheduled';

type Surprise = {
  id: string;
  title: string;
  message: string;
  kind: SurpriseKind;
  requiredXp?: number;
  releaseAt?: Date;
};

const tomorrowAtSix = new Date(Date.now() + 24 * 60 * 60 * 1000);
tomorrowAtSix.setHours(18, 0, 0, 0);

const surprises: Surprise[] = [
  {
    id: 'sunshine',
    title: 'Une petite dose de soleil',
    message: 'Même les journées grises ont de jolies éclaircies. Et toi, tu en es une.',
    kind: 'compliment',
  },
  {
    id: 'smile',
    title: 'Un compliment rien que pour toi',
    message: 'Tu as cette façon bien à toi de rendre les petits moments plus beaux.',
    kind: 'compliment',
  },
  {
    id: 'secret',
    title: 'Un secret bien gardé',
    message: 'Tu mérites une pause, une douceur et au moins un grand sourire aujourd’hui.',
    kind: 'secret',
    requiredXp: 50,
  },
  {
    id: 'quote',
    title: 'Une pensée à garder',
    message: 'Les petites joies ne font pas de bruit, mais elles savent changer toute une journée.',
    kind: 'quote',
  },
  {
    id: 'letter',
    title: 'Une petite lettre',
    message: 'J’espère que tu sais à quel point ta présence rend les choses plus lumineuses. Prends soin de toi, surtout.',
    kind: 'letter',
  },
  {
    id: 'joke',
    title: 'Une blague très sérieuse',
    message: 'Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tombent dans le bateau.',
    kind: 'joke',
  },
  {
    id: 'tomorrow',
    title: 'Une enveloppe pour demain',
    message: 'Petit rappel du futur : tu as le droit de ralentir et de choisir ce qui te fait du bien.',
    kind: 'letter',
    releaseAt: tomorrowAtSix,
  },
  {
    id: 'hidden',
    title: 'Une surprise cachée',
    message: 'Mission accomplie : tu as trouvé une surprise qui n’attendait que toi !',
    kind: 'secret',
    requiredXp: 100,
  },
];

const kindLabels: Record<SurpriseKind, string> = {
  secret: 'Message secret',
  compliment: 'Petit compliment',
  quote: 'Citation originale',
  letter: 'Petite lettre',
  joke: 'Message rigolo',
};

function getSurpriseStatus(
  surprise: Surprise,
  openedIds: readonly string[],
  xp: number,
  scheduledAt: Date | null,
  now: Date,
): SurpriseStatus {
  if (openedIds.includes(surprise.id)) return 'read';
  if (scheduledAt && scheduledAt.getTime() > now.getTime()) return 'scheduled';
  if (surprise.releaseAt && surprise.releaseAt.getTime() > now.getTime()) return 'scheduled';
  if ((surprise.requiredXp ?? 0) > xp) return 'locked';
  return 'unread';
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function SurprisesScreen() {
  const { palette } = useCrushyTheme();
  const reduceMotion = useReducedMotion();
  const openedIds = useCrushyStore((state) => state.openedSurpriseIds);
  const xp = useCrushyStore((state) => state.xp);
  const openSurprise = useCrushyStore((state) => state.openSurprise);
  const scheduledSurprises = useCrushyStore((state) => state.scheduledSurprises);
  const scheduleSurprise = useCrushyStore((state) => state.scheduleSurprise);
  const cancelSchedule = useCrushyStore((state) => state.cancelSurpriseSchedule);
  const notificationsEnabled = useCrushyStore((state) => state.notificationsEnabled);
  const [now, setNow] = useState(() => new Date());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEarnedXp, setSelectedEarnedXp] = useState(false);
  const [scheduleTargetId, setScheduleTargetId] = useState<string | null>(null);
  const [draftDate, setDraftDate] = useState(() => new Date(Date.now() + 60 * 60 * 1000));
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [busy, setBusy] = useState(false);
  const [publishedSurprises, setPublishedSurprises] = useState<ManagedSurprise[]>([]);
  const [contentError, setContentError] = useState('');
  const [loadingSurprises, setLoadingSurprises] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingSurprises(true);
    void fetchPublishedSurprises()
      .then((items) => {
        if (active) setPublishedSurprises(items);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.warn('Impossible de charger les surprises publiées.', error);
        setContentError('Les surprises en ligne sont indisponibles. Tes enveloppes locales restent là.');
      })
      .finally(() => {
        if (active) setLoadingSurprises(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const surpriseItems = useMemo<Surprise[]>(() => [
    ...publishedSurprises.map((surprise) => ({
      id: surprise.id,
      title: surprise.title,
      message: surprise.body,
      kind: surprise.kind,
      requiredXp: surprise.unlock_xp,
      releaseAt: surprise.scheduled_at ? new Date(surprise.scheduled_at) : undefined,
    })),
    ...surprises,
  ], [publishedSurprises]);
  const selected = surpriseItems.find((surprise) => surprise.id === selectedId) ?? null;
  const scheduleTarget = surpriseItems.find((surprise) => surprise.id === scheduleTargetId) ?? null;
  const sortedSurprises = useMemo(() => [...surpriseItems].sort((a, b) => {
    const scheduledA = scheduledSurprises[a.id]?.scheduledAt;
    const scheduledB = scheduledSurprises[b.id]?.scheduledAt;
    const statusA = getSurpriseStatus(a, openedIds, xp, scheduledA ? new Date(scheduledA) : null, now);
    const statusB = getSurpriseStatus(b, openedIds, xp, scheduledB ? new Date(scheduledB) : null, now);
    const order: Record<SurpriseStatus, number> = { unread: 0, scheduled: 1, locked: 2, read: 3 };
    return order[statusA] - order[statusB];
  }), [openedIds, now, scheduledSurprises, surpriseItems, xp]);

  function openCard(surprise: Surprise, status: SurpriseStatus) {
    if (status === 'locked' || status === 'scheduled') return;
    setSelectedEarnedXp(!openedIds.includes(surprise.id));
    openSurprise(surprise.id);
    setSelectedId(surprise.id);
  }

  async function saveSchedule() {
    if (!scheduleTarget) return;
    if (draftDate.getTime() <= Date.now()) {
      Alert.alert('Choisis une heure future', 'La surprise doit être programmée à une date et une heure qui ne sont pas encore passées.');
      return;
    }

    setBusy(true);
    try {
      let notificationId: string | undefined;
      if (notificationsEnabled) {
        notificationId = await scheduleSurpriseNotification(
          'Une petite surprise t’attend',
          'CRUSHY a gardé une enveloppe pour toi.',
          draftDate,
        );
      }

      const currentSchedule = scheduledSurprises[scheduleTarget.id];
      if (currentSchedule?.notificationId) {
        await cancelSurpriseNotification(currentSchedule.notificationId);
      }
      scheduleSurprise(scheduleTarget.id, draftDate.toISOString(), notificationId);
      setScheduleTargetId(null);
    } catch {
      Alert.alert('Programmation impossible', 'La surprise n’a pas pu être programmée. Vérifie les réglages de notification et réessaie.');
    } finally {
      setBusy(false);
    }
  }

  async function removeSchedule(surpriseId: string) {
    const notificationId = scheduledSurprises[surpriseId]?.notificationId;
    try {
      if (notificationId) await cancelSurpriseNotification(notificationId);
      cancelSchedule(surpriseId);
    } catch {
      Alert.alert('Annulation impossible', 'La notification programmée n’a pas pu être annulée.');
    }
  }

  function updateDate(event: DateTimePickerEvent, value?: Date) {
    if (event.type !== 'set' || !value) return;
    const next = new Date(draftDate);
    if (pickerMode === 'date') {
      next.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
    } else {
      next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    }
    setDraftDate(next);
  }

  return (
    <CrushyScreen eyebrow="ENVELOPPE RIEN QUE POUR TOI" title="Boîte à surprises" subtitle="Des mots doux, secrets ou rigolos, à ouvrir quand tu en as envie.">
      <View style={[styles.summary, { backgroundColor: palette.surfaceAlt }]}>
        <Text style={[styles.summaryText, { color: palette.text }]}>{openedIds.length} surprises découvertes · chaque enveloppe garde son petit secret.</Text>
      </View>
      {contentError ? <CrushyStateMessage message={contentError} title="Enveloppes locales disponibles" tone="warning" /> : null}
      {loadingSurprises ? <CrushyStateMessage message="On regarde s’il y a de nouveaux petits mots." title="Un instant" tone="loading" /> : null}
      <SectionHeading>Tes enveloppes</SectionHeading>
      {sortedSurprises.map((surprise, index) => {
        const savedDate = scheduledSurprises[surprise.id]?.scheduledAt;
        const scheduledAt = savedDate ? new Date(savedDate) : null;
        const status = getSurpriseStatus(surprise, openedIds, xp, scheduledAt, now);
        const locked = status === 'locked';
        const scheduled = status === 'scheduled';
        const read = status === 'read';
        const tint = index % 3 === 1 ? palette.lavender : index % 3 === 2 ? palette.yellow : palette.pink;

        return (
          <View key={surprise.id} style={[styles.envelope, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: locked || scheduled }}
              disabled={locked || scheduled}
              onPress={() => openCard(surprise, status)}
              style={({ pressed }) => [styles.envelopeBody, { opacity: pressed ? 0.82 : 1 }]}
            >
              <View style={[styles.seal, { backgroundColor: tint }]}>
                <Ionicons
                  name={locked ? 'lock-closed' : scheduled ? 'time' : read ? 'mail-open' : 'mail'}
                  size={20}
                  color={palette.text}
                />
              </View>
              <View style={styles.envelopeText}>
                <Text style={[styles.envelopeTitle, { color: palette.text }]}>
                  {locked || scheduled ? 'Une enveloppe pour toi' : surprise.title}
                </Text>
                <Text style={[styles.envelopeHint, { color: palette.subtle }]}>
                  {locked
                    ? `À débloquer à ${surprise.requiredXp} XP`
                    : scheduled
                      ? `Programmée · ${formatDate(scheduledAt ?? surprise.releaseAt ?? now)}`
                      : `${kindLabels[surprise.kind]} · ${read ? 'Déjà lue, touche pour relire' : 'À découvrir'}`}
                </Text>
              </View>
              <Text style={[styles.stateLabel, { color: locked ? palette.subtle : read ? palette.subtle : palette.accent }]}>
                {locked ? 'Verrouillée' : scheduled ? 'Programmée' : read ? 'Lue' : 'Non lue'}
              </Text>
            </Pressable>
            {scheduledAt && scheduled ? (
              <Pressable accessibilityRole="button" onPress={() => void removeSchedule(surprise.id)} style={styles.cancelSchedule}>
                <Text style={[styles.cancelScheduleText, { color: palette.accent }]}>Annuler la programmation</Text>
              </Pressable>
            ) : !locked && !read && !scheduled && !surprise.releaseAt ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setDraftDate(new Date(Date.now() + 60 * 60 * 1000));
                  setScheduleTargetId(surprise.id);
                }}
                style={styles.scheduleButton}
              >
                <Text style={[styles.scheduleText, { color: palette.accent }]}>Programmer</Text>
              </Pressable>
            ) : null}
          </View>
        );
      })}

      <Modal animationType="fade" onRequestClose={() => setSelectedId(null)} transparent visible={Boolean(selected)}>
        <View style={[styles.overlay, { backgroundColor: palette.overlay }]}>
          {selected ? (
            <Animated.View entering={reduceMotion ? undefined : FadeInUp.duration(220)} style={[styles.messageCard, { backgroundColor: palette.surface }]}>
              <View style={[styles.messageSeal, { backgroundColor: palette.pink }]}>
                <Ionicons name="heart" size={22} color={palette.text} />
              </View>
              <Text style={[styles.messageKind, { color: palette.accent }]}>{kindLabels[selected.kind].toUpperCase()}</Text>
              <Text style={[styles.messageTitle, { color: palette.text }]}>{selected.title}</Text>
              <Text style={[styles.message, { color: palette.subtle }]}>{selected.message}</Text>
              {selectedEarnedXp ? <Text style={[styles.earned, { color: palette.accent }]}>+5 XP pour ta découverte</Text> : null}
              <CrushyButton onPress={() => setSelectedId(null)}>Garder ce petit mot</CrushyButton>
            </Animated.View>
          ) : null}
        </View>
      </Modal>

      <Modal animationType="fade" onRequestClose={() => setScheduleTargetId(null)} transparent visible={Boolean(scheduleTarget)}>
        <View style={[styles.overlay, { backgroundColor: palette.overlay }]}>
          {scheduleTarget ? (
            <View style={[styles.scheduleCard, { backgroundColor: palette.surface }]}>
              <Text style={[styles.messageKind, { color: palette.accent }]}>PROGRAMMER UNE SURPRISE</Text>
              <Text style={[styles.messageTitle, { color: palette.text }]}>{scheduleTarget.title}</Text>
              <Text style={[styles.message, { color: palette.subtle }]}>Elle s’ouvrira le {formatDate(draftDate)}. Son contenu reste caché d’ici là.</Text>
              <View style={[styles.pickerTabs, { backgroundColor: palette.surfaceAlt }]}>
                {(['date', 'time'] as const).map((mode) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: pickerMode === mode }}
                    key={mode}
                    onPress={() => setPickerMode(mode)}
                    style={[styles.pickerTab, pickerMode === mode && { backgroundColor: palette.pink }]}
                  >
                    <Text style={[styles.pickerTabText, { color: palette.text }]}>{mode === 'date' ? 'Date' : 'Heure'}</Text>
                  </Pressable>
                ))}
              </View>
              <DateTimePicker
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={pickerMode === 'date' ? new Date() : undefined}
                mode={pickerMode}
                onChange={updateDate}
                value={draftDate}
              />
              {!notificationsEnabled ? <Text style={[styles.notificationNote, { color: palette.subtle }]}>Les notifications sont désactivées : la surprise sera disponible à cette heure dans l’application.</Text> : null}
              <CrushyButton disabled={busy} onPress={() => void saveSchedule()}>{busy ? 'Programmation…' : 'Confirmer'}</CrushyButton>
              <CrushyButton secondary disabled={busy} onPress={() => setScheduleTargetId(null)}>Annuler</CrushyButton>
            </View>
          ) : null}
        </View>
      </Modal>
    </CrushyScreen>
  );
}

const styles = StyleSheet.create({
  summary: { borderRadius: designTokens.radius.md, padding: 14, marginTop: 6 },
  summaryText: { fontSize: 13, lineHeight: 19, fontFamily: designTokens.typography.bold },
  envelope: { borderWidth: 1, borderRadius: designTokens.radius.lg, padding: 12, marginBottom: 10 },
  envelopeBody: { flexDirection: 'row', minHeight: 62, alignItems: 'center' },
  seal: { width: 43, height: 43, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  envelopeText: { flex: 1, marginLeft: 12, paddingRight: 6 },
  envelopeTitle: { fontSize: 14, fontFamily: designTokens.typography.bold },
  envelopeHint: { fontSize: 11, lineHeight: 16, marginTop: 3 },
  stateLabel: { fontSize: 10, fontFamily: designTokens.typography.bold, maxWidth: 67, textAlign: 'right' },
  scheduleButton: { alignSelf: 'flex-end', paddingVertical: 7, paddingHorizontal: 8, marginTop: 3, minHeight: 36, justifyContent: 'center' },
  scheduleText: { fontSize: 12, fontFamily: designTokens.typography.bold },
  cancelSchedule: { alignSelf: 'flex-end', padding: 8, minHeight: 36, justifyContent: 'center' },
  cancelScheduleText: { fontSize: 12, fontFamily: designTokens.typography.bold },
  overlay: { flex: 1, justifyContent: 'center', padding: 24 },
  messageCard: { borderRadius: designTokens.radius.xl, padding: 24, alignItems: 'center' },
  messageSeal: { width: 54, height: 54, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  messageKind: { fontSize: 10, letterSpacing: 1.1, fontFamily: designTokens.typography.bold },
  messageTitle: { fontSize: 22, lineHeight: 28, textAlign: 'center', fontFamily: designTokens.typography.extraBold, marginTop: 8 },
  message: { fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 10 },
  earned: { fontSize: 13, fontFamily: designTokens.typography.bold, marginTop: 12 },
  scheduleCard: { borderRadius: designTokens.radius.xl, padding: 19 },
  pickerTabs: { flexDirection: 'row', borderRadius: designTokens.radius.md, padding: 4, marginTop: 15 },
  pickerTab: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  pickerTabText: { fontSize: 13, fontFamily: designTokens.typography.bold },
  notificationNote: { fontSize: 12, lineHeight: 18, marginTop: 7 },
});
