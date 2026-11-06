import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';

type CrushyStateMessageProps = {
  title: string;
  message: string;
  tone?: 'empty' | 'warning' | 'loading';
};

const stateIcons = {
  empty: 'sparkles-outline',
  warning: 'cloud-offline-outline',
  loading: 'hourglass-outline',
} as const;

export function CrushyStateMessage({ title, message, tone = 'empty' }: CrushyStateMessageProps) {
  const { palette } = useCrushyTheme();
  return (
    <View
      accessibilityRole={tone === 'warning' ? 'alert' : undefined}
      style={[styles.container, { backgroundColor: palette.surfaceAlt }]}
    >
      {tone === 'loading' ? (
        <ActivityIndicator color={palette.accent} />
      ) : (
        <Ionicons name={stateIcons[tone]} size={20} color={palette.accent} />
      )}
      <View style={styles.copy}>
        <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
        <Text style={[styles.message, { color: palette.subtle }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: designTokens.radius.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginVertical: 6,
  },
  copy: { flex: 1 },
  title: { fontSize: 13, fontFamily: designTokens.typography.bold },
  message: { fontSize: 12, lineHeight: 18, marginTop: 3 },
});
