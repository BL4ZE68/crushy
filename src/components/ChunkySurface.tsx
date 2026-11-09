import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';

type ChunkyCardProps = PropsWithChildren<{
  /** Couleur de fond de la carte. Par défaut : surface du thème. */
  tint?: string;
  radius?: number;
  /** Profondeur de l'ombre dure. 0 = carte "posée" (sans ombre), utile dans une longue liste. */
  depth?: number;
  outlineWidth?: number;
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Carte au style « sticker » commune à tout CRUSHY : contour épais +
 * ombre dure décalée (comme CrushyButton / FeatureCard). Pour du contenu
 * statique — en-têtes, lignes de réglages, badges — pas pour les éléments
 * cliquables, qui gèrent déjà leur propre enfoncement au clic.
 */
export function ChunkyCard({
  children,
  tint,
  radius = designTokens.radius.lg,
  depth = designTokens.chunky.depth,
  outlineWidth = designTokens.chunky.outline,
  style,
}: ChunkyCardProps) {
  const { palette, isDark } = useCrushyTheme();
  const fill = tint ?? palette.surface;

  return (
    <View style={[{ marginBottom: 0 }, style]}>
      {!isDark && depth > 0 ? (
        <View
          style={[
            styles.shadow,
            { top: depth, bottom: -depth, borderRadius: radius, backgroundColor: palette.shadow },
          ]}
        />
      ) : null}
      <View
        style={[
          styles.card,
          {
            backgroundColor: fill,
            borderColor: palette.ink,
            borderRadius: radius,
            borderWidth: outlineWidth,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: { position: 'absolute', left: 0, right: 0 },
  card: { overflow: 'hidden' },
});
