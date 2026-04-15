import React from 'react';
import Svg, { Path, Polyline, Circle, Line, Rect, Polygon } from 'react-native-svg';

export type IconProps = { size?: number; color?: string; strokeWidth?: number };

function p(props: IconProps) {
  return {
    width:           props.size        ?? 24,
    height:          props.size        ?? 24,
    viewBox:         '0 0 24 24',
    stroke:          props.color       ?? '#1A1A18',
    strokeWidth:     props.strokeWidth ?? 1.5,
    fill:            'none',
    strokeLinecap:   'round'  as const,
    strokeLinejoin:  'round'  as const,
  };
}

// ── Navigation ────────────────────────────────────────────────────

export function HomeIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Path d="M8 21h8M12 17v4" />
      <Path d="M7 4H4a1 1 0 00-1 1v2a4 4 0 004 4h1M17 4h3a1 1 0 011 1v2a4 4 0 01-4 4h-1" />
      <Path d="M7 4h10v9a5 5 0 01-10 0V4z" />
    </Svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Line x1="18" y1="20" x2="18" y2="10" />
      <Line x1="12" y1="20" x2="12" y2="4" />
      <Line x1="6"  y1="20" x2="6"  y2="14" />
    </Svg>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </Svg>
  );
}

// ── Chevrons & arrows ─────────────────────────────────────────────

export function ChevronRightIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Polyline points="9 18 15 12 9 6" />
    </Svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Polyline points="15 18 9 12 15 6" />
    </Svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Line x1="7" y1="17" x2="17" y2="7" />
      <Polyline points="7 7 17 7 17 17" />
    </Svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Line x1="12" y1="19" x2="12" y2="5" />
      <Polyline points="5 12 12 5 19 12" />
    </Svg>
  );
}

// ── Actions ───────────────────────────────────────────────────────

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5"  y1="12" x2="19" y2="12" />
    </Svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Line x1="18" y1="6"  x2="6"  y2="18" />
      <Line x1="6"  y1="6"  x2="18" y2="18" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <Path d="M7 11V7a5 5 0 0110 0v4" />
    </Svg>
  );
}

// ── Module icons ──────────────────────────────────────────────────

export function MicIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Rect x="9" y="2" width="6" height="11" rx="3" />
      <Path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
    </Svg>
  );
}

export function PenIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Svg>
  );
}

export function HeadphoneIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Path d="M3 18v-6a9 9 0 0118 0v6" />
      <Path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
    </Svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </Svg>
  );
}

export function SpeakIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </Svg>
  );
}

// ── Notifications & UI ────────────────────────────────────────────

export function BellIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </Svg>
  );
}

export function LightningIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Path d="M12 2c0 0-4 4-4 8a4 4 0 008 0c0-4-4-8-4-8z" />
      <Path d="M12 10c0 0-2 2-2 4a2 2 0 004 0c0-2-2-4-2-4z" />
    </Svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Line x1="22" y1="2" x2="11" y2="13" />
      <Polygon points="22 2 15 22 11 13 2 9 22 2" />
    </Svg>
  );
}

// ── Settings & misc ───────────────────────────────────────────────

export function GlobeIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="2" y1="12" x2="22" y2="12" />
      <Path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </Svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Circle cx="12" cy="12" r="5" />
      <Line x1="12" y1="1"     x2="12" y2="3"     />
      <Line x1="12" y1="21"    x2="12" y2="23"    />
      <Line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"   />
      <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <Line x1="1"  y1="12"    x2="3"  y2="12"    />
      <Line x1="21" y1="12"    x2="23" y2="12"    />
      <Line x1="4.22" y1="19.78"  x2="5.64" y2="18.36"  />
      <Line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </Svg>
  );
}

export function TypeIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Polyline points="4 7 4 4 20 4 20 7" />
      <Line x1="9" y1="20" x2="15" y2="20" />
      <Line x1="12" y1="4" x2="12" y2="20" />
    </Svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Svg>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <Polyline points="16 17 21 12 16 7" />
      <Line x1="21" y1="12" x2="9" y2="12" />
    </Svg>
  );
}

export function HelpCircleIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <Line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <Line x1="12" y1="18" x2="12.01" y2="18" />
    </Svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <Svg {...p(props)}>
      <Path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <Polyline points="15 3 21 3 21 9" />
      <Line x1="10" y1="14" x2="21" y2="3" />
    </Svg>
  );
}
