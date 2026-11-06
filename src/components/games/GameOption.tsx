import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';

type GameOptionProps = PropsWithChildren<{
  onPress: () => void;
  selected?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}>;

export function GameOption({ children, onPress, selected = false, disabled = false, style }: GameOptionProps) {
  const { palette } = useCrushyTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: selected ? palette.surfaceAlt : palette.surface,
          borderColor: selected ? palette.accent : palette.border,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: palette.text }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: { minHeight: 50, borderWidth: 1, borderRadius: designTokens.radius.md, paddingHorizontal: 15, paddingVertical: 13, justifyContent: 'center', marginTop: 9 },
  text: { fontSize: 14, lineHeight: 20, fontFamily: designTokens.typography.bold },
});
