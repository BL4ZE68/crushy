import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Alert,
  Pressable,
  Share,
  StyleSheet,
  Switch,
  Text,
  Vibration,
  View,
} from 'react-native';
import { ChunkyCard } from '../components/ChunkySurface';
import { CrushyButton } from '../components/CrushyButton';
import { CrushyMascot } from '../components/CrushyMascot';
import { CrushyScreen, SectionHeading } from '../components/CrushyScreen';
import { useCrushyButtonSound } from '../components/CrushyAudioProvider';
import {
  cancelDailyContentReminder,
  requestNotificationPermission,
  scheduleDailyContentReminder,
  sendTestNotification,
} from '../lib/notifications';
import { ThemeMode, useCrushyStore } from '../store/useCrushyStore';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';

type ThemeOption = {
  value: ThemeMode;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
};

const themeModes: ThemeOption[] = [
  {
    value: 'system',
    label: 'Système',
    icon: 'phone-portrait-outline',
    description: 'S’adapte automatiquement au réglage de ton appareil',
  },
  {
    value: 'light',
    label: 'Clair',
    icon: 'sunny-outline',
    description: 'Pétillant, lumineux et plein de tendresse',
  },
  {
    value: 'dark',
    label: 'Sombre',
    icon: 'moon-outline',
    description: 'Doux et reposant pour les yeux en soirée',
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { palette } = useCrushyTheme();
  const playButtonSound = useCrushyButtonSound();

  const nickname = useCrushyStore((state) => state.nickname);
  const xp = useCrushyStore((state) => state.xp);
  const unlockedAchievements = useCrushyStore((state) => state.unlockedAchievements);
  const gameCompletions = useCrushyStore((state) => state.gameCompletions);
  const openedSurprises = useCrushyStore((state) => state.openedSurpriseIds.length);
  const completedGames = Object.values(gameCompletions).reduce((total, count) => total + count, 0);

  const themeMode = useCrushyStore((state) => state.themeMode);
  const setThemeMode = useCrushyStore((state) => state.setThemeMode);
  const notificationsEnabled = useCrushyStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = useCrushyStore((state) => state.setNotificationsEnabled);
  const soundsEnabled = useCrushyStore((state) => state.soundsEnabled);
  const setSoundsEnabled = useCrushyStore((state) => state.setSoundsEnabled);
  const hapticsEnabled = useCrushyStore((state) => state.hapticsEnabled);
  const setHapticsEnabled = useCrushyStore((state) => state.setHapticsEnabled);
  const resetProgress = useCrushyStore((state) => state.resetProgress);

  const [requestingNotifications, setRequestingNotifications] = useState(false);
  const [testingNotification, setTestingNotification] = useState(false);

  function triggerHaptic() {
    if (hapticsEnabled) {
      try {
        Vibration.vibrate(20);
      } catch {
        // Ignoré sur plateformes sans support
      }
    }
  }

  async function toggleNotifications(enabled: boolean) {
    setRequestingNotifications(true);
    triggerHaptic();

    if (!enabled) {
      try {
        await cancelDailyContentReminder();
        setNotificationsEnabled(false);
      } catch {
        Alert.alert('Impossible de désactiver', 'Vérifie les réglages de ton appareil et réessaie.');
      } finally {
        setRequestingNotifications(false);
      }
      return;
    }

    try {
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleDailyContentReminder();
      }
      setNotificationsEnabled(granted);
      if (!granted) {
        Alert.alert(
          'Notifications désactivées',
          'Tu peux les autoriser à tout moment dans les paramètres de ton appareil.'
        );
      }
    } catch {
      Alert.alert('Impossible d’activer', 'Vérifie les autorisations de notifications et réessaie.');
    } finally {
      setRequestingNotifications(false);
    }
  }

  async function handleTestNotification() {
    setTestingNotification(true);
    triggerHaptic();
    try {
      await sendTestNotification();
      Alert.alert('Notification envoyée ! 📬', 'Regarde ton centre de notifications pour voir le coucou de Pip !');
    } catch (error) {
      Alert.alert(
        'Notification non envoyée',
        'Vérifie que les notifications sont bien autorisées sur ton appareil.'
      );
    } finally {
      setTestingNotification(false);
    }
  }

  function handleTestSound() {
    triggerHaptic();
    playButtonSound();
  }

  function handleToggleHaptics(value: boolean) {
    setHapticsEnabled(value);
    if (value) {
      try {
        Vibration.vibrate(30);
      } catch {
        // Ignoré
      }
    }
  }

  async function handleShareStats() {
    triggerHaptic();
    const level = Math.floor(xp / 100) + 1;
    const message = `✨ Mon aventure CRUSHY ✨\n👤 Pseudo : ${nickname}\n⭐ Niveau : ${level} (${xp} XP)\n🏆 Badges obtenus : ${unlockedAchievements.length}/6\n🎮 Jeux terminés : ${completedGames}\n💌 Surprises découvertes : ${openedSurprises}\n\nPrends soin de toi ! 💖`;

    try {
      await Share.share({ message });
    } catch {
      // Ignoré ou annulé par l'utilisateur
    }
  }

  function handleResetConfirm() {
    triggerHaptic();
    Alert.alert(
      'Réinitialiser la progression ?',
      'Cette action remettra à zéro tes points XP, tes badges débloqués et l’historique de tes jeux. Ton pseudo et tes réglages seront conservés.\n\nEs-tu certain(e) de vouloir continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Oui, réinitialiser',
          style: 'destructive',
          onPress: () => {
            resetProgress();
            triggerHaptic();
            Alert.alert('Progression réinitialisée', 'Tu peux repartir sur de nouvelles bases à ton rythme ! 🌱');
          },
        },
      ]
    );
  }

  return (
    <CrushyScreen
      eyebrow="À TON RYTHME"
      title="Réglages"
      subtitle="Choisis l’ambiance, les notifications et contrôle tes données privées."
    >
      {/* 1. Apparence & Thème */}
      <SectionHeading>Apparence & Thème</SectionHeading>
      <View style={styles.themeGroup}>
        {themeModes.map((mode) => {
          const isSelected = themeMode === mode.value;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              key={mode.value}
              onPress={() => {
                triggerHaptic();
                setThemeMode(mode.value);
              }}
              style={({ pressed }) => [
                styles.themePressable,
                { transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <ChunkyCard
                depth={isSelected ? 3 : 0}
                outlineWidth={isSelected ? 2.5 : 1}
                radius={designTokens.radius.lg}
                tint={isSelected ? palette.surface : palette.surfaceAlt}
              >
                <View style={styles.themeCardInner}>
                  <View
                    style={[
                      styles.themeIconCircle,
                      {
                        backgroundColor: isSelected ? palette.pink : palette.surface,
                        borderColor: palette.ink,
                      },
                    ]}
                  >
                    <Ionicons name={mode.icon} size={20} color={palette.ink} />
                  </View>
                  <View style={styles.themeTextContainer}>
                    <Text style={[styles.themeLabel, { color: palette.text }]}>{mode.label}</Text>
                    <Text style={[styles.themeDesc, { color: palette.subtle }]}>{mode.description}</Text>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected ? palette.accent : palette.ink,
                        backgroundColor: isSelected ? palette.accent : palette.surface,
                      },
                    ]}
                  >
                    {isSelected ? <View style={styles.radioDot} /> : null}
                  </View>
                </View>
              </ChunkyCard>
            </Pressable>
          );
        })}
      </View>

      {/* 2. Notifications */}
      <SectionHeading>Notifications & Rappels</SectionHeading>
      <ChunkyCard radius={designTokens.radius.lg} tint={palette.surface} depth={3}>
        <View style={styles.settingBlock}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIconBox, { backgroundColor: palette.peach, borderColor: palette.ink }]}>
              <Ionicons name="notifications-outline" size={20} color={palette.ink} />
            </View>
            <View style={styles.settingCopy}>
              <Text style={[styles.settingTitle, { color: palette.text }]}>Rappel quotidien & surprises</Text>
              <Text style={[styles.settingSubtitle, { color: palette.subtle }]}>
                Reçois chaque matin à 09:15 ta citation, ta blague et l’alerte de tes surprises programmées.
              </Text>
            </View>
            <Switch
              accessibilityLabel="Activer le rappel quotidien"
              disabled={requestingNotifications}
              onValueChange={(val) => void toggleNotifications(val)}
              thumbColor={palette.surface}
              trackColor={{ false: palette.border, true: palette.accent }}
              value={notificationsEnabled}
            />
          </View>

          {notificationsEnabled ? (
            <View style={[styles.notificationDetails, { borderTopColor: palette.border }]}>
              <View style={styles.notificationDetailRow}>
                <View style={styles.badgeRow}>
                  <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                  <Text style={[styles.statusText, { color: palette.text }]}>Actif chaque matin à 09:15</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  disabled={testingNotification}
                  onPress={() => void handleTestNotification()}
                  style={[styles.testBtn, { backgroundColor: palette.surfaceAlt, borderColor: palette.ink }]}
                >
                  <Ionicons name="paper-plane-outline" size={13} color={palette.text} />
                  <Text style={[styles.testBtnText, { color: palette.text }]}>
                    {testingNotification ? 'Envoi…' : 'Tester'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>
      </ChunkyCard>

      {/* 3. Sons et Retours sensoriels */}
      <SectionHeading>Sons & Sensations</SectionHeading>
      <ChunkyCard radius={designTokens.radius.lg} tint={palette.surface} depth={3}>
        <View style={styles.settingBlock}>
          {/* Effets sonores */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIconBox, { backgroundColor: palette.yellow, borderColor: palette.ink }]}>
              <Ionicons name="volume-high-outline" size={20} color={palette.ink} />
            </View>
            <View style={styles.settingCopy}>
              <Text style={[styles.settingTitle, { color: palette.text }]}>Effets sonores (Pop doux)</Text>
              <Text style={[styles.settingSubtitle, { color: palette.subtle }]}>
                Un petit son ludique et tactile accompagne les boutons et les victoires.
              </Text>
            </View>
            <Switch
              accessibilityLabel="Activer les retours sonores"
              onValueChange={(val) => {
                triggerHaptic();
                setSoundsEnabled(val);
              }}
              thumbColor={palette.surface}
              trackColor={{ false: palette.border, true: palette.accent }}
              value={soundsEnabled}
            />
          </View>

          {soundsEnabled ? (
            <View style={[styles.subActionRow, { borderTopColor: palette.border }]}>
              <Pressable
                accessibilityRole="button"
                onPress={handleTestSound}
                style={[styles.testSoundBtn, { backgroundColor: palette.surfaceAlt, borderColor: palette.ink }]}
              >
                <Ionicons name="play" size={12} color={palette.text} />
                <Text style={[styles.testSoundText, { color: palette.text }]}>Écouter un exemple de son</Text>
              </Pressable>
            </View>
          ) : null}

          {/* Vibrations & retours haptiques */}
          <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: palette.border, marginTop: 12, paddingTop: 14 }]}>
            <View style={[styles.settingIconBox, { backgroundColor: palette.lavender, borderColor: palette.ink }]}>
              <Ionicons name="phone-portrait-outline" size={20} color={palette.ink} />
            </View>
            <View style={styles.settingCopy}>
              <Text style={[styles.settingTitle, { color: palette.text }]}>Vibrations & retours tactiles</Text>
              <Text style={[styles.settingSubtitle, { color: palette.subtle }]}>
                Légères pulsations haptiques lors des sélections et mini-jeux.
              </Text>
            </View>
            <Switch
              accessibilityLabel="Activer les vibrations haptiques"
              onValueChange={handleToggleHaptics}
              thumbColor={palette.surface}
              trackColor={{ false: palette.border, true: palette.accent }}
              value={hapticsEnabled}
            />
          </View>
        </View>
      </ChunkyCard>

      {/* 4. Données et Confidentialité */}
      <SectionHeading>Données & Confidentialité</SectionHeading>
      <ChunkyCard radius={designTokens.radius.lg} tint={palette.surface} depth={3}>
        <View style={styles.dataBlock}>
          <View style={styles.privacyHeader}>
            <View style={[styles.lockCircle, { backgroundColor: palette.mint, borderColor: palette.ink }]}>
              <Ionicons name="shield-checkmark" size={20} color={palette.ink} />
            </View>
            <View style={styles.privacyCopy}>
              <Text style={[styles.privacyTitle, { color: palette.text }]}>100% Privé et sur ton appareil</Text>
              <Text style={[styles.privacyDesc, { color: palette.subtle }]}>
                Ton prénom, tes humeurs, tes scores et tes surprises sont conservés localement sur ton téléphone. Aucun compte n’est imposé et aucune donnée n’est vendue.
              </Text>
            </View>
          </View>

          <View style={[styles.dataActionGroup, { borderTopColor: palette.border }]}>
            <Pressable
              accessibilityRole="button"
              onPress={() => void handleShareStats()}
              style={[styles.shareStatsBtn, { backgroundColor: palette.surfaceAlt, borderColor: palette.ink }]}
            >
              <Ionicons name="share-social-outline" size={17} color={palette.text} />
              <Text style={[styles.shareStatsText, { color: palette.text }]}>
                Partager mon résumé de progression
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={handleResetConfirm}
              style={[styles.resetBtn, { borderColor: palette.accent }]}
            >
              <Ionicons name="trash-outline" size={15} color={palette.accent} />
              <Text style={[styles.resetBtnText, { color: palette.accent }]}>
                Réinitialiser les scores et badges
              </Text>
            </Pressable>
          </View>
        </View>
      </ChunkyCard>

      {/* 5. À propos */}
      <SectionHeading>À propos de CRUSHY</SectionHeading>
      <ChunkyCard radius={designTokens.radius.lg} tint={palette.pink} depth={3} style={styles.aboutCardWrap}>
        <View style={styles.aboutInner}>
          <CrushyMascot expression="amoureuse" size={72} interactive />
          <View style={styles.aboutCopy}>
            <Text style={[styles.aboutTitle, { color: palette.text }]}>CRUSHY · Jelly Pop</Text>
            <Text style={[styles.aboutVersion, { color: palette.text }]}>Version 1.0.0 · Avec Pip</Text>
            <Text style={[styles.aboutHeart, { color: palette.text }]}>
              Conçu pour apporter un sourire, une bulle de réconfort et de la joie au quotidien.
            </Text>
          </View>
        </View>
      </ChunkyCard>

      <Text style={[styles.savedLocallyNotice, { color: palette.subtle }]}>
        CRUSHY respecte ta tranquillité. Fait avec amour. 💖
      </Text>

      <View style={styles.footerSpacing} />
    </CrushyScreen>
  );
}

const styles = StyleSheet.create({
  themeGroup: {
    gap: 10,
    marginTop: 4,
  },
  themePressable: {
    marginBottom: 2,
  },
  themeCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  themeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeTextContainer: {
    flex: 1,
  },
  themeLabel: {
    fontSize: 14,
    fontFamily: designTokens.typography.bold,
  },
  themeDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  settingBlock: {
    padding: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingCopy: {
    flex: 1,
    paddingRight: 6,
  },
  settingTitle: {
    fontSize: 14,
    fontFamily: designTokens.typography.bold,
  },
  settingSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  notificationDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  notificationDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: designTokens.typography.bold,
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: designTokens.radius.md,
    borderWidth: 1.5,
  },
  testBtnText: {
    fontSize: 11,
    fontFamily: designTokens.typography.bold,
  },
  subActionRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  testSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: designTokens.radius.md,
    borderWidth: 1.5,
  },
  testSoundText: {
    fontSize: 12,
    fontFamily: designTokens.typography.bold,
  },
  dataBlock: {
    padding: 15,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  lockCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyCopy: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 14,
    fontFamily: designTokens.typography.bold,
  },
  privacyDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  dataActionGroup: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  shareStatsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    borderRadius: designTokens.radius.md,
    borderWidth: 1.5,
  },
  shareStatsText: {
    fontSize: 13,
    fontFamily: designTokens.typography.bold,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 40,
    borderRadius: designTokens.radius.md,
    borderWidth: 1.5,
  },
  resetBtnText: {
    fontSize: 12,
    fontFamily: designTokens.typography.bold,
  },
  aboutCardWrap: {
    marginTop: 4,
  },
  aboutInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  aboutCopy: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 16,
    fontFamily: designTokens.typography.extraBold,
  },
  aboutVersion: {
    fontSize: 12,
    fontFamily: designTokens.typography.bold,
    marginTop: 2,
    opacity: 0.9,
  },
  aboutHeart: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
    opacity: 0.85,
  },
  savedLocallyNotice: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 18,
    textAlign: 'center',
  },
  footerSpacing: {
    height: 30,
  },
});
