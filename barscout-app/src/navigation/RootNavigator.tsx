import { NavigationContainer } from '@react-navigation/native';
import { useOnboarding } from '@/hooks/useOnboarding';
import BottomTabs from './BottomTabs';
import OnboardingScreen from '@/screens/OnboardingScreen';

export default function RootNavigator() {
  const { status, completeOnboarding } = useOnboarding();

  if (status === 'loading') return null;

  if (status === 'onboarding') {
    return <OnboardingScreen onDone={completeOnboarding} />;
  }

  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
