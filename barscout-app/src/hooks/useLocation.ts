import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { Linking } from 'react-native';

type LocationState =
  | { status: 'idle' }
  | { status: 'requesting' }
  | { status: 'denied'; canAskAgain: boolean }
  | { status: 'success'; coords: { latitude: number; longitude: number } }
  | { status: 'error'; message: string };

const LOCATION_TIMEOUT_MS = 15_000;

export function useLocation() {
  const [state, setState] = useState<LocationState>({ status: 'idle' });

  const requestLocation = useCallback(async () => {
    setState({ status: 'requesting' });

    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setState({ status: 'denied', canAskAgain });
      return;
    }

    try {
      const result = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Location timed out')), LOCATION_TIMEOUT_MS),
        ),
      ]);

      setState({
        status: 'success',
        coords: {
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        },
      });
    } catch (e) {
      setState({ status: 'error', message: (e as Error).message });
    }
  }, []);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return { state, requestLocation, openSettings };
}
