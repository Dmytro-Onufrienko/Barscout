import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@barscout:onboarded';

type Status = 'loading' | 'onboarding' | 'ready';

type OnboardingContextValue = {
  status: Status;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
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

  const resetOnboarding = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setStatus('onboarding');
  };

  return (
    <OnboardingContext.Provider value={{ status, completeOnboarding, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboardingContext must be used within OnboardingProvider');
  return ctx;
}
