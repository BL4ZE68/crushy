import { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type CrushyMascotProps = {
  reduceMotion?: boolean;
  size?: 'welcome' | 'compact';
};

export function CrushyMascot({ reduceMotion, size = 'welcome' }: CrushyMascotProps) {
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion ?? systemReducedMotion;
  const bob = useSharedValue(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      bob.set(0);
      return;
    }

    bob.set(
      withRepeat(
        withTiming(-5, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      ),
    );

    return () => cancelAnimation(bob);
  }, [bob, shouldReduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.get() }] }));

  return (
    <Animated.Image
      source={require('../../assets/mascotte-crushy.png')}
      resizeMode="contain"
      accessibilityLabel="Pip, la petite mascotte de CRUSHY"
      accessibilityRole="image"
      style={[size === 'compact' ? styles.compact : styles.welcome, animatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  welcome: { width: 250, height: 212 },
  compact: { width: 138, height: 117 },
});
