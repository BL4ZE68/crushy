import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';
import {
  Accessory,
  BODY_PATH,
  expressionLabels,
  faces,
  GLOSS,
  PIP_INK,
  PIP_VIEWBOX,
  PipExpression,
  Shape,
} from './pip/faces';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type CrushyMascotProps = {
  /** Expression de Pip. Une humeur de l'app (`heureuse`, `triste`…) ou `neutre` / `wow`. */
  expression?: PipExpression | null;
  /** Largeur en points ; la hauteur suit les proportions du dessin. */
  size?: number;
  reduceMotion?: boolean;
  /** Si vrai (défaut), toucher Pip le fait sauter et réagir. */
  interactive?: boolean;
  onPress?: () => void;
};

export function CrushyMascot({
  expression,
  size = 200,
  reduceMotion,
  interactive = true,
  onPress,
}: CrushyMascotProps) {
  const systemReducedMotion = useReducedMotion();
  const still = reduceMotion ?? systemReducedMotion;
  const [override, setOverride] = useState<PipExpression | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current: PipExpression = override ?? expression ?? 'neutre';
  const face = faces[current];

  const breathe = useSharedValue(0);
  const bob = useSharedValue(0);
  const jump = useSharedValue(0);
  const squash = useSharedValue(1);
  const blink = useSharedValue(1);

  useEffect(() => {
    if (still) {
      breathe.set(0);
      bob.set(0);
      blink.set(1);
      return;
    }
    const period = 1500 / Math.max(face.energy, 0.4);
    breathe.set(withRepeat(withTiming(1, { duration: period, easing: Easing.inOut(Easing.sin) }), -1, true));
    bob.set(
      withRepeat(
        withTiming(-5 * face.energy, { duration: period, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      ),
    );
    blink.set(
      withRepeat(
        withSequence(
          withDelay(2600, withTiming(0.08, { duration: 80 })),
          withTiming(1, { duration: 120 }),
          withDelay(180, withTiming(0.08, { duration: 70 })),
          withTiming(1, { duration: 110 }),
        ),
        -1,
        false,
      ),
    );
    return () => {
      cancelAnimation(breathe);
      cancelAnimation(bob);
      cancelAnimation(blink);
    };
  }, [blink, bob, breathe, face.energy, still]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const bodyStyle = useAnimatedStyle(() => {
    const sy = (1 + breathe.get() * 0.035) * squash.get();
    const sx = 1 + (1 - sy) * 0.7;
    return {
      transform: [{ translateY: bob.get() + jump.get() }, { scaleX: sx }, { scaleY: sy }],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const lift = -(bob.get() + jump.get());
    return { transform: [{ scaleX: 1 - Math.min(lift, 40) * 0.008 }], opacity: 1 - Math.min(lift, 40) * 0.012 };
  });

  function react() {
    onPress?.();
    if (timer.current) clearTimeout(timer.current);
    setOverride('wow');
    timer.current = setTimeout(() => setOverride(null), 900);
    if (still) return;
    jump.set(
      withSequence(
        withTiming(-size * 0.16, { duration: 170, easing: Easing.out(Easing.quad) }),
        withSpring(0, { damping: 5, stiffness: 170 }),
      ),
    );
    squash.set(
      withSequence(withTiming(0.86, { duration: 70 }), withTiming(1.1, { duration: 170 }), withSpring(1, { damping: 6 })),
    );
  }

  const height = (size * PIP_VIEWBOX.height) / PIP_VIEWBOX.width;
  const body = (
    <View style={{ width: size, height }} accessible={false}>
      <Animated.View style={[styles.shadow, { width: size * 0.62, bottom: height * 0.01 }, shadowStyle]} />
      <Animated.View style={[StyleSheet.absoluteFill, bodyStyle]}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${PIP_VIEWBOX.width} ${PIP_VIEWBOX.height}`}>
          <Defs>
            <RadialGradient id="pipBody" cx="38%" cy="30%" r="80%">
              <Stop offset="0" stopColor="#FFD6E1" />
              <Stop offset="1" stopColor="#FF8FB1" />
            </RadialGradient>
          </Defs>
          <Path d={BODY_PATH} fill="url(#pipBody)" stroke={PIP_INK} strokeWidth={4.5} strokeLinejoin="round" />
          {GLOSS.map((s, i) => (
            <PipShape key={`g${i}`} shape={s} />
          ))}
          {face.shapes.map((s, i) => (
            <PipShape key={`${current}-${i}`} shape={s} />
          ))}
          {face.eyes?.map((eye, i) => (
            <PipEye key={`${current}-eye${i}`} {...eye} blink={blink} />
          ))}
        </Svg>
      </Animated.View>
      {face.accessories.map((acc, i) => (
        <Floaty key={`${current}-${i}`} accessory={acc} size={size} still={still} />
      ))}
    </View>
  );

  if (!interactive) {
    return (
      <View accessible accessibilityRole="image" accessibilityLabel={`Pip, la mascotte de CRUSHY, ${expressionLabels[current]}`}>
        {body}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Pip, la mascotte de CRUSHY, ${expressionLabels[current]}`}
      accessibilityHint="Touche Pip pour la faire réagir"
      onPress={react}
    >
      {body}
    </Pressable>
  );
}

function PipShape({ shape }: { shape: Shape }) {
  if (shape.t === 'path') {
    return (
      <Path
        d={shape.d}
        fill={shape.fill ?? 'none'}
        stroke={shape.stroke}
        strokeWidth={shape.stroke ? (shape.sw ?? 4) : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={shape.op}
      />
    );
  }
  if (shape.t === 'ellipse') {
    return <Ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} fill={shape.fill} opacity={shape.op} />;
  }
  return <Circle cx={shape.cx} cy={shape.cy} r={shape.r} fill={shape.fill} opacity={shape.op} />;
}

function PipEye({
  cx,
  cy,
  rx,
  ry,
  shine,
  blink,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  shine: number;
  blink: SharedValue<number>;
}) {
  const eyeProps = useAnimatedProps(() => ({ ry: ry * blink.get() }));
  const shineProps = useAnimatedProps(() => ({ opacity: blink.get() > 0.6 ? 1 : 0 }));
  return (
    <>
      <AnimatedEllipse cx={cx} cy={cy} rx={rx} fill={PIP_INK} animatedProps={eyeProps} />
      <AnimatedCircle cx={cx + 4} cy={cy - 5} r={4.2 * shine} fill="#FFFFFF" animatedProps={shineProps} />
      <AnimatedCircle cx={cx - 3.5} cy={cy + 6} r={2 * shine} fill="#FFFFFF" animatedProps={shineProps} />
    </>
  );
}

const accessoryGlyph = {
  heart: { glyph: '♥', color: '#E5245F' },
  sparkle: { glyph: '✦', color: '#FFB400' },
  zzz: { glyph: 'z', color: '#7B5CC9' },
  note: { glyph: '♪', color: '#2E9E78' },
} as const;

function Floaty({ accessory, size, still }: { accessory: Accessory; size: number; still: boolean }) {
  const progress = useSharedValue(0);
  const { glyph, color } = accessoryGlyph[accessory.kind];
  const scale = accessory.scale ?? 1;

  useEffect(() => {
    if (still) {
      progress.set(0.5);
      return;
    }
    progress.set(
      withDelay(
        accessory.delay,
        withRepeat(withTiming(1, { duration: 2400, easing: Easing.out(Easing.quad) }), -1, false),
      ),
    );
    return () => cancelAnimation(progress);
  }, [accessory.delay, progress, still]);

  const style = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      opacity: still ? 1 : p < 0.15 ? p / 0.15 : p > 0.7 ? Math.max(0, (1 - p) / 0.3) : 1,
      transform: [{ translateY: -p * size * 0.14 }, { scale: 0.75 + p * 0.35 }],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.floaty, { left: accessory.x * size, top: accessory.y * size }, style]}
    >
      <Text style={[styles.glyph, { color, fontSize: size * 0.13 * scale }]}>{glyph}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    alignSelf: 'center',
    height: 10,
    borderRadius: 999,
    backgroundColor: PIP_INK,
    opacity: 0.16,
  },
  floaty: { position: 'absolute' },
  glyph: { fontWeight: '800' },
});
