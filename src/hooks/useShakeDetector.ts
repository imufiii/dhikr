import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

interface Options {
  enabled: boolean;
  onShake: () => void;
  threshold?: number;
  cooldown?: number;
}

export function useShakeDetector({
  enabled,
  onShake,
  threshold = 1.8,
  cooldown = 400,
}: Options) {
  const lastShake = useRef(0);
  const onShakeRef = useRef(onShake);
  onShakeRef.current = onShake;

  useEffect(() => {
    if (!enabled) return;
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      if (magnitude > threshold) {
        const now = Date.now();
        if (now - lastShake.current > cooldown) {
          lastShake.current = now;
          onShakeRef.current();
        }
      }
    });
    return () => sub.remove();
  }, [enabled, threshold, cooldown]);
}
