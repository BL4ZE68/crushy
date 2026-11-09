import { Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';

type FeatureCardProps = {
  title: string;
  description: string;
  label?: string;
  href: Href;
  tint?: string;
  emoji?: string;
};

export function FeatureCard({ title, description, label, href, tint, emoji }: FeatureCardProps) {
  const { palette, isDark } = useCrushyTheme();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return (
    <View style={styles.wrap}>
      {!isDark ? <View style={[styles.shadow, { backgroundColor: palette.shadow }]} /> : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(href)}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: tint ?? palette.surface,
            borderColor: palette.ink,
            transform: reduceMotion ? undefined : [{ translateY: pressed && !isDark ? designTokens.chunky.depth : 0 }],
          },
        ]}
      >
        {label ? (
          <View style={[styles.tag, { backgroundColor: palette.surfaceAlt, borderColor: palette.ink }]}>
            <Text style={[styles.tagText, { color: palette.accent }]}>{label}</Text>
          </View>
        ) : null}
        <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
        <Text style={[styles.description, { color: palette.subtle }]}>{description}</Text>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <Text accessibilityElementsHidden style={[styles.arrow, { color: palette.accent }]}>→</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  shadow: {
    position: 'absolute',
    top: designTokens.chunky.depth,
    left: 0,
    right: 0,
    bottom: -designTokens.chunky.depth,
    borderRadius: designTokens.radius.lg,
  },
  card: {
    borderWidth: designTokens.chunky.outline,
    borderRadius: designTokens.radius.lg,
    padding: 17,
    minHeight: 120,
  },
  tag: { alignSelf: 'flex-start', borderWidth: 1.5, borderRadius: designTokens.radius.pill, paddingHorizontal: 9, paddingVertical: 4, marginBottom: 12 },
  tagText: { fontSize: 10, fontFamily: designTokens.typography.bold, letterSpacing: 0.3 },
  title: { fontSize: 16, fontFamily: designTokens.typography.bold, paddingRight: 20 },
  description: { fontSize: 13, lineHeight: 19, marginTop: 4, paddingRight: 36 },
  emoji: { position: 'absolute', right: 16, top: 14, fontSize: 26 },
  arrow: { position: 'absolute', right: 17, bottom: 15, fontSize: 18 },
});
