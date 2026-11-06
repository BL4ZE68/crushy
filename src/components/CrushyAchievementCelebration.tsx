import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useCrushyStore } from '../store/useCrushyStore';
import { useCrushyTheme } from '../theme/useCrushyTheme';
import { designTokens } from '../theme/theme';

const confettiColors = ['#FF6FAE', '#C8B6FF', '#FFE58F', '#FFB6D5', '#51416D'];

export function CrushyAchievementCelebration() {
  const hasHydrated = useCrushyStore((state) => state.hasHydrated);
  const unlockedIds = useCrushyStore((state) => state.unlockedAchievements);
  const previousIds = useRef<string[] | null>(null);
  const [newBadges, setNewBadges] = useState(0);
  const reduceMotion = useReducedMotion();
  const { palette } = useCrushyTheme();

  useEffect(() => {
    if (!hasHydrated) return;
    if (previousIds.current === null) {
      previousIds.current = unlockedIds;
      return;
    }

    const unlockedBefore = new Set(previousIds.current);
    const count = unlockedIds.filter((id) => !unlockedBefore.has(id)).length;
    previousIds.current = unlockedIds;
    if (count === 0) return;

    setNewBadges(count);
    const timer = setTimeout(() => setNewBadges(0), 2300);
    return () => clearTimeout(timer);
  }, [hasHydrated, unlockedIds]);

  if (!newBadges) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {!reduceMotion ? <ConfettiRain /> : null}
      <Animated.View
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        entering={reduceMotion ? undefined : FadeInUp.duration(220)}
        style={[styles.toast, { backgroundColor: palette.text }]}
      >
        <Text style={[styles.toastText, { color: palette.background }]}>
          {newBadges === 1 ? 'Nouveau badge débloqué !' : `${newBadges} nouveaux badges débloqués !`}
        </Text>
      </Animated.View>
    </View>
  );
}

function ConfettiRain() {
  const { width, height } = useWindowDimensions();
  return (
    <View style={StyleSheet.absoluteFill}>
      {Array.from({ length: 16 }, (_, index) => (
        <ConfettiPiece
          color={confettiColors[index % confettiColors.length]}
          height={height}
          index={index}
          key={index}
          width={width}
        />
      ))}
    </View>
  );
}

function ConfettiPiece({
  color,
  height,
  index,
  width,
}: {
  color: string;
  height: number;
  index: number;
  width: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1300 + (index % 4) * 110 });
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.12, 0.78, 1], [0, 1, 1, 0]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [-30, height * 0.58]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, index % 2 ? 520 : -520])}deg` },
    ],
  }));
  const left = ((index * 47 + 13) % 97) / 100 * width;

  return (
    <Animated.View
      style={[
        styles.confetti,
        { backgroundColor: color, left, top: 0, height: index % 3 === 0 ? 13 : 9 },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 52,
    alignSelf: 'center',
    borderRadius: designTokens.radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  toastText: { fontSize: 13, fontFamily: designTokens.typography.bold },
  confetti: { position: 'absolute', width: 7, borderRadius: 2 },
});
