import React from 'react';
import Svg, {
  Rect, Circle, Line, Polygon, Path, G,
  Defs, LinearGradient, Stop, ClipPath,
} from 'react-native-svg';

type FP = { width?: number; height?: number };

// ── Star polygon helper ───────────────────────────────────────────
function star(cx: number, cy: number, R: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 - 90) * (Math.PI / 180);
    const radius = i % 2 === 0 ? R : r;
    pts.push(`${(cx + radius * Math.cos(a)).toFixed(2)},${(cy + radius * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

// ── EN — Union Jack ───────────────────────────────────────────────
export function FlagEN({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="60" height="40" fill="#012169" />
      {/* St Andrew's white X */}
      <Line x1="0" y1="0" x2="60" y2="40" stroke="white" strokeWidth="10" />
      <Line x1="60" y1="0" x2="0" y2="40" stroke="white" strokeWidth="10" />
      {/* St Patrick's red X (thin) */}
      <Line x1="0" y1="0" x2="60" y2="40" stroke="#C8102E" strokeWidth="4" />
      <Line x1="60" y1="0" x2="0" y2="40" stroke="#C8102E" strokeWidth="4" />
      {/* St George's white cross */}
      <Rect x="24" y="0" width="12" height="40" fill="white" />
      <Rect x="0" y="14" width="60" height="12" fill="white" />
      {/* St George's red cross */}
      <Rect x="26" y="0" width="8" height="40" fill="#C8102E" />
      <Rect x="0" y="16" width="60" height="8" fill="#C8102E" />
    </Svg>
  );
}

// ── ES — Spain ────────────────────────────────────────────────────
export function FlagES({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="60" height="10" fill="#AA151B" />
      <Rect y="10" width="60" height="20" fill="#F1BF00" />
      <Rect y="30" width="60" height="10" fill="#AA151B" />
    </Svg>
  );
}

// ── FR — France ───────────────────────────────────────────────────
export function FlagFR({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="20" height="40" fill="#002395" />
      <Rect x="20" width="20" height="40" fill="white" />
      <Rect x="40" width="20" height="40" fill="#ED2939" />
    </Svg>
  );
}

// ── DE — Germany ──────────────────────────────────────────────────
export function FlagDE({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="60" height="13" fill="#000000" />
      <Rect y="13" width="60" height="14" fill="#DD0000" />
      <Rect y="27" width="60" height="13" fill="#FFCE00" />
    </Svg>
  );
}

// ── IT — Italy ────────────────────────────────────────────────────
export function FlagIT({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="20" height="40" fill="#009246" />
      <Rect x="20" width="20" height="40" fill="white" />
      <Rect x="40" width="20" height="40" fill="#CE2B37" />
    </Svg>
  );
}

// ── PT — Portugal ─────────────────────────────────────────────────
export function FlagPT({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="24" height="40" fill="#006600" />
      <Rect x="24" width="36" height="40" fill="#FF0000" />
      {/* Simplified coat of arms: yellow circle + white center */}
      <Circle cx="24" cy="20" r="8" fill="#FFD700" />
      <Circle cx="24" cy="20" r="5.5" fill="white" />
      <Circle cx="24" cy="20" r="3" fill="#003399" />
    </Svg>
  );
}

// ── ZH — China ───────────────────────────────────────────────────
export function FlagZH({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="60" height="40" fill="#DE2910" />
      {/* Large star */}
      <Polygon points={star(11, 11, 6.5, 2.8)} fill="#FFDE00" />
      {/* Small stars */}
      <Polygon points={star(22, 5, 2.5, 1.0)} fill="#FFDE00" />
      <Polygon points={star(26.5, 10, 2.5, 1.0)} fill="#FFDE00" />
      <Polygon points={star(26, 17, 2.5, 1.0)} fill="#FFDE00" />
      <Polygon points={star(21.5, 22, 2.5, 1.0)} fill="#FFDE00" />
    </Svg>
  );
}

// ── JA — Japan ───────────────────────────────────────────────────
export function FlagJA({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="60" height="40" fill="white" />
      <Circle cx="30" cy="20" r="12" fill="#BC002D" />
    </Svg>
  );
}

// ── KO — Korea ───────────────────────────────────────────────────
export function FlagKO({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="60" height="40" fill="white" />
      {/* Taeguk: red top half */}
      <Path
        d="M20,20 A10,10 0 0,1 40,20 A5,5 0 0,1 30,20 A5,5 0 0,0 20,20"
        fill="#C60C30"
      />
      {/* Blue bottom half */}
      <Path
        d="M20,20 A10,10 0 0,0 40,20 A5,5 0 0,0 30,20 A5,5 0 0,1 20,20"
        fill="#003478"
      />
      {/* Black trigrams (simplified lines) */}
      <G opacity="0.85">
        {/* Top-left trigram (3 lines) */}
        <Rect x="8" y="10" width="8" height="1.8" rx="0.9" fill="#000" />
        <Rect x="8" y="13.2" width="8" height="1.8" rx="0.9" fill="#000" />
        <Rect x="8" y="16.4" width="8" height="1.8" rx="0.9" fill="#000" />
        {/* Top-right trigram */}
        <Rect x="44" y="10" width="8" height="1.8" rx="0.9" fill="#000" />
        <Rect x="44" y="13.2" width="3.2" height="1.8" rx="0.9" fill="#000" />
        <Rect x="48.8" y="13.2" width="3.2" height="1.8" rx="0.9" fill="#000" />
        <Rect x="44" y="16.4" width="8" height="1.8" rx="0.9" fill="#000" />
        {/* Bottom-left trigram */}
        <Rect x="8" y="22" width="8" height="1.8" rx="0.9" fill="#000" />
        <Rect x="8" y="25.2" width="3.2" height="1.8" rx="0.9" fill="#000" />
        <Rect x="12.8" y="25.2" width="3.2" height="1.8" rx="0.9" fill="#000" />
        <Rect x="8" y="28.4" width="3.2" height="1.8" rx="0.9" fill="#000" />
        <Rect x="12.8" y="28.4" width="3.2" height="1.8" rx="0.9" fill="#000" />
        {/* Bottom-right trigram */}
        <Rect x="44" y="22" width="3.2" height="1.8" rx="0.9" fill="#000" />
        <Rect x="48.8" y="22" width="3.2" height="1.8" rx="0.9" fill="#000" />
        <Rect x="44" y="25.2" width="3.2" height="1.8" rx="0.9" fill="#000" />
        <Rect x="48.8" y="25.2" width="3.2" height="1.8" rx="0.9" fill="#000" />
        <Rect x="44" y="28.4" width="8" height="1.8" rx="0.9" fill="#000" />
      </G>
    </Svg>
  );
}

// ── AR — Saudi Arabia ─────────────────────────────────────────────
export function FlagAR({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="60" height="40" fill="#006C35" />
      {/* Shahada text (simplified horizontal bar) */}
      <Rect x="10" y="13" width="40" height="2.5" rx="1.2" fill="white" opacity="0.9" />
      <Rect x="14" y="17" width="32" height="2" rx="1" fill="white" opacity="0.7" />
      {/* Sword */}
      <Rect x="12" y="24" width="30" height="1.8" rx="0.9" fill="white" opacity="0.9" />
      <Path d="M42,23.5 L45.5,25.4 L42,27.3 Z" fill="white" opacity="0.9" />
    </Svg>
  );
}

// ── NL — Netherlands ─────────────────────────────────────────────
export function FlagNL({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="60" height="13" fill="#AE1C28" />
      <Rect y="13" width="60" height="14" fill="white" />
      <Rect y="27" width="60" height="13" fill="#21468B" />
    </Svg>
  );
}

// ── RU — Russia ───────────────────────────────────────────────────
export function FlagRU({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="60" height="13" fill="white" />
      <Rect y="13" width="60" height="14" fill="#0039A6" />
      <Rect y="27" width="60" height="13" fill="#D52B1E" />
    </Svg>
  );
}

// ── HI — India ───────────────────────────────────────────────────
export function FlagHI({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="60" height="13" fill="#FF9933" />
      <Rect y="13" width="60" height="14" fill="white" />
      <Rect y="27" width="60" height="13" fill="#138808" />
      {/* Ashoka Chakra (simplified) */}
      <Circle cx="30" cy="20" r="5" fill="none" stroke="#000080" strokeWidth="1.3" />
      <Circle cx="30" cy="20" r="0.8" fill="#000080" />
    </Svg>
  );
}

// ── TR — Turkey ───────────────────────────────────────────────────
export function FlagTR({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="60" height="40" fill="#E30A17" />
      {/* Crescent */}
      <Circle cx="27" cy="20" r="8" fill="white" />
      <Circle cx="30" cy="20" r="6.2" fill="#E30A17" />
      {/* Star */}
      <Polygon points={star(38, 20, 3.5, 1.5)} fill="white" />
    </Svg>
  );
}

// ── FA — Iran ────────────────────────────────────────────────────
export function FlagFA({ width = 60, height = 40 }: FP) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <Rect width="60" height="13" fill="#239F40" />
      <Rect y="13" width="60" height="14" fill="white" />
      <Rect y="27" width="60" height="13" fill="#DA0000" />
      {/* Tulip emblem (simplified) */}
      <Circle cx="30" cy="20" r="3.5" fill="#DA0000" opacity="0.5" />
    </Svg>
  );
}

// ── Selector ─────────────────────────────────────────────────────
const FLAG_MAP: Record<string, (p: FP) => JSX.Element> = {
  en: (p) => <FlagEN {...p} />,
  es: (p) => <FlagES {...p} />,
  fr: (p) => <FlagFR {...p} />,
  de: (p) => <FlagDE {...p} />,
  it: (p) => <FlagIT {...p} />,
  pt: (p) => <FlagPT {...p} />,
  zh: (p) => <FlagZH {...p} />,
  ja: (p) => <FlagJA {...p} />,
  ko: (p) => <FlagKO {...p} />,
  ar: (p) => <FlagAR {...p} />,
  nl: (p) => <FlagNL {...p} />,
  ru: (p) => <FlagRU {...p} />,
  hi: (p) => <FlagHI {...p} />,
  tr: (p) => <FlagTR {...p} />,
  fa: (p) => <FlagFA {...p} />,
};

export function FlagSVG({ code, width = 60, height = 40 }: { code: string; width?: number; height?: number }) {
  const render = FLAG_MAP[code] ?? FLAG_MAP.en;
  return render({ width, height });
}
