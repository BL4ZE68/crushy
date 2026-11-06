import { StyleSheet, Text, View } from 'react-native';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';

export function GameFeedback({ children, success = false }: { children: string; success?: boolean }) {
  const { palette } = useCrushyTheme();
  return (
    <View style={[styles.container, { backgroundColor: success ? palette.pink : palette.surfaceAlt }]}>
      <Text style={[styles.text, { color: palette.text }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: designTokens.radius.md, padding: 14, marginTop: 14 },
  text: { fontSize: 14, lineHeight: 21, fontFamily: designTokens.typography.bold },
});
