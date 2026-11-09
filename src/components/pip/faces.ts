import type { Mood } from '../../store/useCrushyStore';

/**
 * Pip est décrite par des données pures (aucune dépendance à React Native) :
 * le composant les anime, et on peut aussi les rendre en SVG statique pour
 * des aperçus ou des icônes.
 */
export type PipExpression = Mood | 'neutre' | 'wow';

export const PIP_VIEWBOX = { width: 200, height: 190 } as const;
export const PIP_INK = '#3A1626';
export const PIP_BLUSH = '#FF5C8A';

export type Shape =
  | { t: 'path'; d: string; fill?: string; stroke?: string; sw?: number; op?: number }
  | { t: 'ellipse'; cx: number; cy: number; rx: number; ry: number; fill: string; op?: number }
  | { t: 'circle'; cx: number; cy: number; r: number; fill: string; op?: number };

export type EyeSpec = { cx: number; cy: number; rx: number; ry: number; shine: number };

export type AccessoryKind = 'heart' | 'sparkle' | 'zzz' | 'note';
export type Accessory = { kind: AccessoryKind; x: number; y: number; delay: number; scale?: number };

export type Face = {
  /** Yeux ouverts (animés : clignement). `null` si l'expression dessine ses propres yeux. */
  eyes: EyeSpec[] | null;
  shapes: Shape[];
  accessories: Accessory[];
  /** Amplitude du rebond, 1 = normal. */
  energy: number;
};

export const BODY_PATH =
  'M18 148 C8 98 40 38 100 34 C160 38 192 98 182 148 C179 172 150 178 100 178 C50 178 21 172 18 148 Z';

export const GLOSS: Shape[] = [
  { t: 'path', d: 'M42 82 Q50 58 84 48', stroke: '#FFFFFF', sw: 8, op: 0.8 },
  { t: 'circle', cx: 34, cy: 102, r: 4.5, fill: '#FFFFFF', op: 0.75 },
];

const cheeks = (op = 0.5): Shape[] => [
  { t: 'ellipse', cx: 47, cy: 128, rx: 15, ry: 9.5, fill: PIP_BLUSH, op },
  { t: 'ellipse', cx: 153, cy: 128, rx: 15, ry: 9.5, fill: PIP_BLUSH, op },
];

const brow = (d: string): Shape => ({ t: 'path', d, stroke: PIP_INK, sw: 4.5 });
const line = (d: string): Shape => ({ t: 'path', d, stroke: PIP_INK, sw: 4.5 });

const openMouth = (w: number, h: number): Shape[] => [
  {
    t: 'path',
    d: `M${100 - w} 122 Q100 ${128 + h * 0.1} ${100 + w} 122 Q${100 + w * 0.7} ${122 + h} 100 ${122 + h} Q${100 - w * 0.7} ${122 + h} ${100 - w} 122 Z`,
    fill: PIP_INK,
  },
  { t: 'ellipse', cx: 100, cy: 122 + h - 6, rx: w * 0.45, ry: 5, fill: '#FF6F96' },
];

const standardEyes: EyeSpec[] = [
  { cx: 69, cy: 104, rx: 11, ry: 14, shine: 1 },
  { cx: 131, cy: 104, rx: 11, ry: 14, shine: 1 },
];

const heart = (cx: number, cy: number, s: number): Shape[] => [
  {
    t: 'path',
    d: `M${cx} ${cy + s * 0.95} C${cx - s * 1.7} ${cy - s * 0.1} ${cx - s * 1.0} ${cy - s * 1.35} ${cx} ${cy - s * 0.4} C${cx + s * 1.0} ${cy - s * 1.35} ${cx + s * 1.7} ${cy - s * 0.1} ${cx} ${cy + s * 0.95} Z`,
    fill: '#E5245F',
    stroke: PIP_INK,
    sw: 2.5,
  },
  { t: 'circle', cx: cx - s * 0.5, cy: cy - s * 0.25, r: s * 0.2, fill: '#FFFFFF' },
];

export const faces: Record<PipExpression, Face> = {
  neutre: {
    eyes: standardEyes,
    shapes: [...cheeks(), line('M88 124 Q100 134 112 124')],
    accessories: [],
    energy: 1,
  },
  heureuse: {
    eyes: standardEyes,
    shapes: [...cheeks(0.55), ...openMouth(15, 24)],
    accessories: [],
    energy: 1.2,
  },
  amoureuse: {
    eyes: null,
    shapes: [
      ...cheeks(0.7),
      ...heart(69, 102, 11),
      ...heart(131, 102, 11),
      line('M89 125 Q100 137 111 125'),
    ],
    accessories: [],
    energy: 1.1,
  },
  énergique: {
    eyes: [
      { cx: 69, cy: 102, rx: 12.5, ry: 16, shine: 1.15 },
      { cx: 131, cy: 102, rx: 12.5, ry: 16, shine: 1.15 },
    ],
    shapes: [
      ...cheeks(0.55),
      brow('M54 78 Q68 68 82 76'),
      brow('M118 76 Q132 68 146 78'),
      ...openMouth(19, 30),
    ],
    accessories: [],
    energy: 1.7,
  },
  fatiguée: {
    eyes: null,
    shapes: [
      ...cheeks(0.4),
      line('M57 106 Q69 116 81 106'),
      line('M119 106 Q131 116 143 106'),
      line('M92 128 Q100 133 108 128'),
    ],
    accessories: [],
    energy: 0.45,
  },
  rêveuse: {
    eyes: [
      { cx: 69, cy: 103, rx: 11.5, ry: 14.5, shine: 1.4 },
      { cx: 131, cy: 103, rx: 11.5, ry: 14.5, shine: 1.4 },
    ],
    shapes: [...cheeks(0.5), line('M90 126 Q100 134 110 126')],
    accessories: [],
    energy: 0.8,
  },
  triste: {
    eyes: standardEyes,
    shapes: [
      ...cheeks(0.35),
      brow('M56 92 Q68 90 82 82'),
      brow('M118 82 Q132 90 144 92'),
      line('M88 135 Q100 123 112 135'),
      {
        t: 'path',
        d: 'M150 118 Q143 130 150 137 Q158 130 150 118 Z',
        fill: '#8FD3FF',
        stroke: PIP_INK,
        sw: 2,
      },
    ],
    accessories: [],
    energy: 0.35,
  },
  wow: {
    eyes: [
      { cx: 69, cy: 102, rx: 13, ry: 17.5, shine: 1.2 },
      { cx: 131, cy: 102, rx: 13, ry: 17.5, shine: 1.2 },
    ],
    shapes: [
      ...cheeks(0.55),
      brow('M54 76 Q68 66 82 74'),
      brow('M118 74 Q132 66 146 76'),
      { t: 'ellipse', cx: 100, cy: 132, rx: 8, ry: 10, fill: PIP_INK },
      { t: 'ellipse', cx: 100, cy: 137, rx: 4.5, ry: 4.5, fill: '#FF6F96' },
    ],
    accessories: [],
    energy: 1.4,
  },
};

export const expressionLabels: Record<PipExpression, string> = {
  neutre: 'sourit doucement',
  heureuse: 'est toute contente',
  amoureuse: 'a des cœurs dans les yeux',
  énergique: 'déborde d’énergie',
  fatiguée: 'a un peu sommeil',
  rêveuse: 'rêve les yeux ouverts',
  triste: 'a un petit coup de blues',
  wow: 'est toute surprise',
};

const esc = (n: number) => Number(n.toFixed(2));

/** Rendu SVG statique (aperçus, tests, exports). */
export function renderPipSvg(expression: PipExpression, opts: { bodyFrom?: string; bodyTo?: string } = {}): string {
  const { bodyFrom = '#FFD6E1', bodyTo = '#FF8FB1' } = opts;
  const face = faces[expression];
  const shapeToSvg = (s: Shape): string => {
    if (s.t === 'path') {
      const stroke = s.stroke ? ` stroke="${s.stroke}" stroke-width="${s.sw ?? 4}" stroke-linecap="round" stroke-linejoin="round"` : '';
      return `<path d="${s.d}" fill="${s.fill ?? 'none'}"${stroke}${s.op != null ? ` opacity="${s.op}"` : ''}/>`;
    }
    if (s.t === 'ellipse') return `<ellipse cx="${s.cx}" cy="${s.cy}" rx="${s.rx}" ry="${s.ry}" fill="${s.fill}"${s.op != null ? ` opacity="${s.op}"` : ''}/>`;
    return `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${s.fill}"${s.op != null ? ` opacity="${s.op}"` : ''}/>`;
  };
  const eyes = (face.eyes ?? [])
    .map((e) =>
      `<ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx}" ry="${e.ry}" fill="${PIP_INK}"/>` +
      `<circle cx="${esc(e.cx + 4)}" cy="${esc(e.cy - 5)}" r="${esc(4.2 * e.shine)}" fill="#fff"/>` +
      `<circle cx="${esc(e.cx - 3.5)}" cy="${esc(e.cy + 6)}" r="${esc(2 * e.shine)}" fill="#fff" opacity=".85"/>`,
    )
    .join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PIP_VIEWBOX.width} ${PIP_VIEWBOX.height}">` +
    `<defs><radialGradient id="g" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="${bodyFrom}"/><stop offset="1" stop-color="${bodyTo}"/></radialGradient></defs>` +
    `<ellipse cx="100" cy="184" rx="62" ry="6" fill="${PIP_INK}" opacity=".16"/>` +
    `<path d="${BODY_PATH}" fill="url(#g)" stroke="${PIP_INK}" stroke-width="4.5" stroke-linejoin="round"/>` +
    GLOSS.map(shapeToSvg).join('') +
    face.shapes.map(shapeToSvg).join('') +
    eyes +
    `</svg>`
  );
}
