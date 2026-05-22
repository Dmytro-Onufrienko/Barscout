import { useState, useCallback } from 'react';
import { useCameraPermissions } from 'expo-camera';
import { Linking } from 'react-native';

type PermissionState =
  | { status: 'idle' }
  | { status: 'requesting' }
  | { status: 'granted' }
  | { status: 'denied'; canAskAgain: boolean };

export function useCameraPermission() {
  const [state, setState] = useState<PermissionState>({ status: 'idle' });
  const [permission, requestPermission] = useCameraPermissions();

  const request = useCallback(async () => {
    if (permission?.granted) {
      setState({ status: 'granted' });
      return;
    }

    setState({ status: 'requesting' });
    const result = await requestPermission();

    if (result.granted) {
      setState({ status: 'granted' });
    } else {
      setState({ status: 'denied', canAskAgain: result.canAskAgain });
    }
  }, [permission, requestPermission]);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return { state, request, openSettings };
}
