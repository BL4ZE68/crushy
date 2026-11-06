import { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useCrushyButtonSound } from './CrushyAudioProvider';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';

type CrushyButtonProps = PropsWithChildren<Omit<PressableProps, 'style'> & { secondary?: boolean; style?: StyleProp<ViewStyle> }>;

export function CrushyButton({ children, secondary = false, style, onPress, ...props }: CrushyButtonProps) {
  const { palette } = useCrushyTheme();
  const playButtonSound = useCrushyButtonSound();
  const reduceMotion = useReducedMotion();
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: secondary ? palette.surfaceAlt : palette.text,
          opacity: pressed ? 0.84 : 1,
          transform: [{ scale: pressed && !reduceMotion ? 0.985 : 1 }],
        },
        style,
      ]}
      onPress={(event) => {
        playButtonSound();
        onPress?.(event);
      }}
      {...props}
    >
      <Text style={[styles.label, { color: secondary ? palette.text : palette.background }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: designTokens.radius.lg,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  label: { fontSize: 15, fontFamily: designTokens.typography.bold },
});
