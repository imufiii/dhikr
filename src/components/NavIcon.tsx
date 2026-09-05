import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../constants/theme';

interface Props {
  name: string;
  size?: number;
  color?: string;
}

// Gold line-icons for the bottom tab bar and counter actions.
export default function NavIcon({ name, size = 22, color = colors.gold }: Props) {
  const s = {
    stroke: color,
    strokeWidth: 1.7,
    fill: 'none' as const,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const w = (c: React.ReactNode) => <Svg width={size} height={size} viewBox="0 0 24 24">{c}</Svg>;

  switch (name) {
    case 'counter':
      return w(<>
        <Circle cx={12} cy={12} r={8.5} {...s} />
        <Circle cx={12} cy={12} r={2.3} fill={color} />
      </>);
    case 'duas':
      return w(<Path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H18a1 1 0 0 1 1 1v13H5.5A1.5 1.5 0 0 0 4 19.5ZM8 4v14" {...s} />);
    case 'myday':
      return w(<>
        <Path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5Z" {...s} />
        <Path d="M4 9.5h16M8 3.5v3M16 3.5v3M8.5 14.5l2.2 2.2 4-4.4" {...s} />
      </>);
    case 'settings':
      return w(<>
        <Circle cx={12} cy={12} r={3} {...s} />
        <Path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1L14.6 3h-4l-.3 2.6a7 7 0 0 0-1.7 1L6.3 5.6l-2 3.4L6.3 10.5a7 7 0 0 0 0 3L4.3 15l2 3.4 2.3-1a7 7 0 0 0 1.7 1l.3 2.6h4l.3-2.6a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5a7 7 0 0 0 .1-1z" {...s} />
      </>);
    case 'reset':
      return w(<Path d="M4 4v5h5M4.6 13a7.5 7.5 0 1 0 1.6-5.1" {...s} />);
    case 'pocket':
      return w(<Path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z" {...s} />);
    default:
      return null;
  }
}
