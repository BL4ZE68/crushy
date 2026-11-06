import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { CrushyScreen, SectionHeading } from '../components/CrushyScreen';
import { requestNotificationPermission } from '../lib/notifications';
import { designTokens } from '../theme/theme';
import { ThemeMode, useCrushyStore } from '../store/useCrushyStore';
import { useCrushyTheme } from '../theme/useCrushyTheme';

const themeModes: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'Système' },
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
];

export default function SettingsScreen() {
  const { palette } = useCrushyTheme();
  const themeMode = useCrushyStore((state) => state.themeMode);
  const setThemeMode = useCrushyStore((state) => state.setThemeMode);
  const notificationsEnabled = useCrushyStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = useCrushyStore((state) => state.setNotificationsEnabled);
  const soundsEnabled = useCrushyStore((state) => state.soundsEnabled);
  const setSoundsEnabled = useCrushyStore((state) => state.setSoundsEnabled);
  const [requesting, setRequesting] = useState(false);

  async function toggleNotifications(enabled: boolean) {
    if (!enabled) {
      setNotificationsEnabled(false);
      return;
    }

    setRequesting(true);
    try {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
      if (!granted) Alert.alert('Notifications désactivées', 'Tu peux les autoriser dans les réglages Android.');
    } catch {
      Alert.alert('Impossible d’activer les notifications', 'Vérifie les réglages de ton appareil et réessaie.');
    } finally {
      setRequesting(false);
    }
  }

  return (
    <CrushyScreen eyebrow="À TON RYTHME" title="Réglages" subtitle="Choisis comment CRUSHY s’adapte à toi.">
      <SectionHeading>Apparence</SectionHeading>
      <View style={[styles.modeGroup, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        {themeModes.map((mode) => {
          const selected = themeMode === mode.value;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              key={mode.value}
              onPress={() => setThemeMode(mode.value)}
              style={[styles.mode, { backgroundColor: selected ? palette.surfaceAlt : 'transparent' }]}
            >
              <Text style={[styles.modeText, { color: palette.text }]}>{mode.label}</Text>
              <View style={[styles.radio, { borderColor: selected ? palette.accent : palette.border, backgroundColor: selected ? palette.accent : palette.surface }]} />
            </Pressable>
          );
        })}
      </View>
      <SectionHeading>Notifications</SectionHeading>
      <View style={[styles.notification, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.notificationCopy}>
          <Text style={[styles.notificationTitle, { color: palette.text }]}>Petites surprises</Text>
          <Text style={[styles.notificationSubtitle, { color: palette.subtle }]}>Tu gardes le choix de les activer ou non.</Text>
        </View>
        <Switch
          accessibilityLabel="Activer les notifications"
          disabled={requesting}
          onValueChange={(value) => void toggleNotifications(value)}
          value={notificationsEnabled}
          trackColor={{ false: palette.border, true: palette.accent }}
          thumbColor={palette.surface}
        />
      </View>
      <SectionHeading>Sons</SectionHeading>
      <View style={[styles.notification, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.notificationCopy}>
          <Text style={[styles.notificationTitle, { color: palette.text }]}>Retour sonore</Text>
          <Text style={[styles.notificationSubtitle, { color: palette.subtle }]}>Un petit son accompagne les boutons. Désactivé par défaut.</Text>
        </View>
        <Switch
          accessibilityLabel="Activer les sons de CRUSHY"
          onValueChange={setSoundsEnabled}
          value={soundsEnabled}
          trackColor={{ false: palette.border, true: palette.accent }}
          thumbColor={palette.surface}
        />
      </View>
      <Text style={[styles.savedLocally, { color: palette.subtle }]}>
        Ta progression et tes préférences restent sauvegardées sur cet appareil.
      </Text>
    </CrushyScreen>
  );
}

const styles = StyleSheet.create({
  modeGroup: { borderWidth: 1, borderRadius: designTokens.radius.lg, overflow: 'hidden' },
  mode: { minHeight: 53, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modeText: { fontSize: 14, fontFamily: designTokens.typography.bold },
  radio: { width: 18, height: 18, borderWidth: 2, borderRadius: 9 },
  notification: { borderWidth: 1, borderRadius: designTokens.radius.lg, padding: 15, flexDirection: 'row', alignItems: 'center' },
  notificationCopy: { flex: 1, paddingRight: 10 },
  notificationTitle: { fontSize: 14, fontFamily: designTokens.typography.bold },
  notificationSubtitle: { fontSize: 12, lineHeight: 17, marginTop: 4 },
  savedLocally: { fontSize: 12, lineHeight: 18, marginTop: 20, textAlign: 'center' },
});
