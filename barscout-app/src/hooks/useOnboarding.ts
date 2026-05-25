import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@barscout:onboarded';

type Status = 'loading' | 'onboarding' | 'ready';

export function useOnboarding() {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      setStatus(value ? 'ready' : 'onboarding');
    });
  }, []);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, '1');
    setStatus('ready');
  };

  return { status, completeOnboarding };
}
