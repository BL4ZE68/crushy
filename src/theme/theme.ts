export type ThemeName = 'light' | 'dark';

type SemanticPalette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  subtle: string;
  border: string;
  accent: string;
  pink: string;
  lavender: string;
  yellow: string;
};

export const palettes: Record<ThemeName, SemanticPalette> = {
  light: {
    background: '#FFF9FC',
    surface: '#FFFFFF',
    surfaceAlt: '#FFF0F7',
    text: '#51416D',
    subtle: '#6E617B',
    border: '#EDE4F0',
    accent: '#FF6FAE',
    pink: '#FFB6D5',
    lavender: '#C8B6FF',
    yellow: '#FFE58F',
  },
  dark: {
    background: '#211B2C',
    surface: '#30283D',
    surfaceAlt: '#3B304A',
    text: '#FFF9FC',
    subtle: '#D5C9E0',
    border: '#51445F',
    accent: '#FF8ABD',
    pink: '#FFB6D5',
    lavender: '#51416D',
    yellow: '#FFE58F',
  },
};

export const designTokens = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { md: 16, lg: 24, xl: 32, pill: 999 },
  typography: {
    family: 'Nunito',
    regular: 'Nunito_400Regular',
    bold: 'Nunito_700Bold',
    extraBold: 'Nunito_800ExtraBold',
  },
} as const;
