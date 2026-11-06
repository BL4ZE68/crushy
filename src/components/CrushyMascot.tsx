import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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
};

export function CrushyMascot({ reduceMotion }: CrushyMascotProps) {
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
    <Animated.View
      accessibilityLabel="Pip, la petite mascotte de CRUSHY"
      accessibilityRole="image"
      style={[styles.mascot, animatedStyle]}
    >
      <View style={styles.earLeft} />
      <View style={styles.earRight} />
      <View style={styles.body}>
        <View style={styles.face}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
        <View style={styles.cheeks}>
          <View style={styles.cheek} />
          <View style={styles.cheek} />
        </View>
        <View style={styles.smile} />
        <View style={styles.bellyHeart} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mascot: { width: 142, height: 128, alignItems: 'center', justifyContent: 'flex-end' },
  body: {
    width: 116,
    height: 104,
    borderRadius: 48,
    backgroundColor: '#FFF9FC',
    alignItems: 'center',
    paddingTop: 37,
    shadowColor: '#51416D',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  earLeft: {
    position: 'absolute',
    top: 12,
    left: 30,
    width: 39,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#FFB6D5',
    transform: [{ rotate: '-22deg' }],
  },
  earRight: {
    position: 'absolute',
    top: 12,
    right: 30,
    width: 39,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#FFB6D5',
    transform: [{ rotate: '22deg' }],
  },
  face: { flexDirection: 'row', gap: 27 },
  eye: { width: 8, height: 11, borderRadius: 5, backgroundColor: '#51416D' },
  cheeks: { width: 72, flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },
  cheek: { width: 12, height: 7, borderRadius: 6, backgroundColor: '#FFB6D5' },
  smile: {
    width: 11,
    height: 6,
    marginTop: -3,
    borderBottomWidth: 2,
    borderColor: '#51416D',
    borderRadius: 8,
  },
  bellyHeart: {
    width: 12,
    height: 12,
    marginTop: 11,
    backgroundColor: '#FF6FAE',
    borderRadius: 3,
    transform: [{ rotate: '45deg' }],
  },
});
