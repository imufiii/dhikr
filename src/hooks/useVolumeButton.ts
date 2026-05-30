import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

interface Options {
  enabled: boolean;
  onPress: () => void;
}

export function useVolumeButton({ enabled, onPress }: Options) {
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

  useEffect(() => {
    if (!enabled || Platform.OS !== 'android') return;

    let VolumeManager: any;
    try {
      VolumeManager = require('react-native-volume-manager').default;
    } catch {
      return;
    }

    const sub = VolumeManager.addVolumeListener(() => {
      onPressRef.current();
    });

    return () => sub.remove();
  }, [enabled]);
}
