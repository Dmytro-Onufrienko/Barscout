import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

const SHAKE_THRESHOLD = 1.78;
const SHAKE_TIMEOUT_MS = 1000;
const UPDATE_INTERVAL_MS = 100;

export function useShakeDetector(onShake: () => void, enabled = true) {
  const lastShakeRef = useRef(0);
  const callbackRef = useRef(onShake);

  useEffect(() => {
    callbackRef.current = onShake;
  }, [onShake]);

  useEffect(() => {
    if (!enabled) return;

    Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const force = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (force > SHAKE_THRESHOLD && now - lastShakeRef.current > SHAKE_TIMEOUT_MS) {
        lastShakeRef.current = now;
        callbackRef.current();
      }
    });

    return () => subscription.remove();
  }, [enabled]);
}
