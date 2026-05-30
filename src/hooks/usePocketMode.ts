import { useCallback, useRef, useState } from 'react';
import * as Brightness from 'expo-brightness';

export function usePocketMode() {
  const [active, setActive] = useState(false);
  const originalBrightness = useRef<number | null>(null);

  const enter = useCallback(async () => {
    try {
      originalBrightness.current = await Brightness.getBrightnessAsync();
      await Brightness.setBrightnessAsync(0.01);
    } catch {}
    setActive(true);
  }, []);

  const exit = useCallback(async () => {
    try {
      if (originalBrightness.current !== null) {
        await Brightness.setBrightnessAsync(originalBrightness.current);
      }
    } catch {}
    setActive(false);
  }, []);

  return { pocketMode: active, enterPocketMode: enter, exitPocketMode: exit };
}
