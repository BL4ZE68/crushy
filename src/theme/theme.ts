export type ThemeName = 'light' | 'dark';

type SemanticPalette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  subtle: string;
  border: string;
  accent: string;
  overlay: string;
  pink: string;
  lavender: string;
  yellow: string;
  /** Couleurs « bonbon » ajoutées par le redesign Jelly Pop. */
  mint: string;
  sky: string;
  peach: string;
  /** Trait épais des composants (contour) et ombre dure en dessous. */
  ink: string;
  shadow: string;
  /** Texte posé sur la couleur d'accent. */
  onAccent: string;
};

export const palettes: Record<ThemeName, SemanticPalette> = {
  light: {
    background: '#FFF0F4',
    surface: '#FFFFFF',
    surfaceAlt: '#FFE0EA',
    text: '#3A1626',
    subtle: '#785264',
    border: '#F2BED0',
    accent: '#C2185B',
    overlay: '#3A162699',
    pink: '#FFB3C7',
    lavender: '#DCCBFF',
    yellow: '#FFE27A',
    mint: '#B6F0D3',
    sky: '#BFE3FF',
    peach: '#FFCBA6',
    ink: '#3A1626',
    shadow: '#3A1626',
    onAccent: '#FFFFFF',
  },
  dark: {
    background: '#21121B',
    surface: '#301B28',
    surfaceAlt: '#412333',
    text: '#FFF0F5',
    subtle: '#D7B5C4',
    border: '#604052',
    accent: '#FF78A5',
    overlay: '#12080ECC',
    pink: '#71364F',
    lavender: '#49375F',
    yellow: '#5D4C2B',
    mint: '#285044',
    sky: '#2D4B5D',
    peach: '#604333',
    ink: '#F3A0BC',
    shadow: '#10070D',
    onAccent: '#35101F',
  },
};

export const designTokens = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { md: 16, lg: 24, xl: 32, pill: 999 },
  /** Épaisseur du contour et profondeur de l'ombre dure (style « sticker »). */
  chunky: { outline: 2.5, depth: 4 },
  typography: {
    family: 'Nunito',
    regular: 'Nunito_400Regular',
    bold: 'Nunito_700Bold',
    extraBold: 'Nunito_800ExtraBold',
  },
} as const;
