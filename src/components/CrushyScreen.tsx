import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCrushyTheme } from '../theme/useCrushyTheme';
import { designTokens } from '../theme/theme';

type CrushyScreenProps = PropsWithChildren<{
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  scroll?: boolean;
}>;

export function CrushyScreen({ children, title, eyebrow, subtitle, scroll = true }: CrushyScreenProps) {
  const { palette } = useCrushyTheme();
  const reduceMotion = useReducedMotion();
  const content = (
    <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(180)} style={styles.content}>
      {eyebrow ? <Text style={[styles.eyebrow, { color: palette.accent }]}>{eyebrow}</Text> : null}
      {title ? <Text style={[styles.title, { color: palette.text }]}>{title}</Text> : null}
      {subtitle ? <Text style={[styles.subtitle, { color: palette.subtle }]}>{subtitle}</Text> : null}
      {children}
    </Animated.View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: palette.background }]}>
      {scroll ? (
        <ScrollView
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export function SectionHeading({ children }: PropsWithChildren) {
  const { palette } = useCrushyTheme();
  return <Text style={[styles.sectionHeading, { color: palette.text }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 34 },
  content: { flexGrow: 1, width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 16 },
  eyebrow: { fontSize: 11, letterSpacing: 1.4, fontWeight: '800', marginBottom: 8 },
  title: { fontSize: 30, lineHeight: 36, fontFamily: designTokens.typography.extraBold, letterSpacing: -0.3 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 6, marginBottom: 20, fontFamily: designTokens.typography.regular },
  sectionHeading: { fontSize: 18, fontFamily: designTokens.typography.bold, marginBottom: 12, marginTop: 24 },
});
