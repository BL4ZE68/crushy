import { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useCrushyButtonSound } from './CrushyAudioProvider';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';

type CrushyButtonProps = PropsWithChildren<
  Omit<PressableProps, 'style'> & { secondary?: boolean; tone?: string; style?: StyleProp<ViewStyle> }
>;

/**
 * Bouton « sticker » : contour épais + ombre dure décalée qui s'aplatit à
 * l'appui, pour un rendu jouet/gélatineux cohérent avec Pip.
 */
export function CrushyButton({ children, secondary = false, tone, style, onPress, disabled, ...props }: CrushyButtonProps) {
  const { palette, isDark } = useCrushyTheme();
  const playButtonSound = useCrushyButtonSound();
  const reduceMotion = useReducedMotion();
  const fill = tone ?? (secondary ? palette.surface : palette.accent);
  const labelColor = tone ? palette.text : secondary ? palette.text : palette.onAccent;

  return (
    <View style={[styles.wrap, disabled && styles.disabledWrap, style]}>
      {!isDark ? <View style={[styles.shadow, { backgroundColor: palette.shadow }]} /> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: Boolean(disabled) }}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: fill,
            borderColor: palette.ink,
            transform: reduceMotion
              ? undefined
              : [{ translateY: pressed && !isDark ? designTokens.chunky.depth : 0 }],
          },
        ]}
        onPress={(event) => {
          playButtonSound();
          onPress?.(event);
        }}
        {...props}
      >
        <Text style={[styles.label, { color: labelColor }]}>{children}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 12 },
  disabledWrap: { opacity: 0.5 },
  shadow: {
    position: 'absolute',
    top: designTokens.chunky.depth,
    left: 0,
    right: 0,
    bottom: -designTokens.chunky.depth,
    borderRadius: designTokens.radius.lg,
  },
  button: {
    minHeight: 50,
    borderRadius: designTokens.radius.lg,
    borderWidth: designTokens.chunky.outline,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15, fontFamily: designTokens.typography.bold },
});
