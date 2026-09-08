import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../constants/theme';

interface Props {
  name: string;
  size?: number;
  color?: string;
}

// Gold line-icons for dua collections and the time-aware feature eyebrow.
export default function DuaIcon({ name, size = 18, color = colors.gold }: Props) {
  const stroke = {
    stroke: color,
    strokeWidth: 1.7,
    fill: 'none' as const,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const wrap = (children: React.ReactNode) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">{children}</Svg>
  );

  switch (name) {
    case 'morning': // sunrise
      return wrap(<>
        <Circle cx={12} cy={14} r={3.4} {...stroke} />
        <Path d="M12 6.5V4.5M5 14H3M21 14h-2M6.4 8.4 5 7M17.6 8.4 19 7M3 19h18" {...stroke} />
      </>);
    case 'sun':
      return wrap(<>
        <Circle cx={12} cy={12} r={4} {...stroke} />
        <Path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" {...stroke} />
      </>);
    case 'sleep': // crescent
      return wrap(<Path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z" {...stroke} />);
    case 'prayer': // mihrab / dome
      return wrap(<Path d="M6 20v-8a6 6 0 0 1 12 0v8M4 20h16M12 6V3.5" {...stroke} />);
    case 'purification': // droplet
      return wrap(<Path d="M12 3s6 6 6 10a6 6 0 0 1-12 0c0-4 6-10 6-10Z" {...stroke} />);
    case 'daily': // home
      return wrap(<Path d="M4 11 12 4l8 7M6 10v10h12V10M10 20v-6h4v6" {...stroke} />);
    case 'forgiveness': // heart
      return wrap(<Path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" {...stroke} />);
    case 'reliance': // leaf
      return wrap(<Path d="M12 3C7 8 7 16 12 21c5-5 5-13 0-18ZM12 4v16" {...stroke} />);
    case 'distress': // shield
      return wrap(<Path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6Z" {...stroke} />);
    default: // sparkle (custom / other)
      return wrap(<Path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8Z" {...stroke} />);
  }
}
