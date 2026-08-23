import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

interface Options {
  enabled: boolean;
  onPress: () => void;
}

export function useVolumeButton({ enabled, onPress }: Options) {
  const onPressRef = useRef(onPress);
  const subscriberRef = useRef<any>(null);
  onPressRef.current = onPress;

  useEffect(() => {
    if (!enabled) return;

    // Volume button only works on Android
    if (Platform.OS !== 'android') {
      console.log('Volume button feature: iOS not yet supported');
      return;
    }

    let isMounted = true;

    const setupVolumeListener = async () => {
      try {
        const VolumeManager = require('react-native-volume-manager').default;
        if (!VolumeManager) {
          console.warn('VolumeManager not available');
          return;
        }

        const sub = VolumeManager.addVolumeListener(() => {
          if (isMounted) {
            onPressRef.current();
          }
        });

        subscriberRef.current = sub;
      } catch (error) {
        console.warn('Failed to setup volume listener:', error);
      }
    };

    setupVolumeListener();

    return () => {
      isMounted = false;
      if (subscriberRef.current?.remove) {
        subscriberRef.current.remove();
      }
    };
  }, [enabled]);
}
