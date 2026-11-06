import { Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';

type FeatureCardProps = {
  title: string;
  description: string;
  label?: string;
  href: Href;
  tint?: string;
};

export function FeatureCard({ title, description, label, href, tint }: FeatureCardProps) {
  const { palette } = useCrushyTheme();
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(href)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: tint ?? palette.surface, borderColor: palette.border, opacity: pressed ? 0.82 : 1 },
      ]}
    >
      {label ? (
        <View style={[styles.tag, { backgroundColor: palette.surfaceAlt }]}>
          <Text style={[styles.tagText, { color: palette.accent }]}>{label}</Text>
        </View>
      ) : null}
      <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
      <Text style={[styles.description, { color: palette.subtle }]}>{description}</Text>
      <Text accessibilityElementsHidden style={[styles.arrow, { color: palette.accent }]}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: designTokens.radius.lg,
    padding: 17,
    minHeight: 132,
    marginBottom: 12,
  },
  tag: { alignSelf: 'flex-start', borderRadius: designTokens.radius.pill, paddingHorizontal: 9, paddingVertical: 4, marginBottom: 12 },
  tagText: { fontSize: 10, fontFamily: designTokens.typography.bold, letterSpacing: 0.3 },
  title: { fontSize: 16, fontFamily: designTokens.typography.bold, paddingRight: 20 },
  description: { fontSize: 13, lineHeight: 19, marginTop: 4, paddingRight: 14 },
  arrow: { position: 'absolute', right: 17, bottom: 15, fontSize: 18 },
});
