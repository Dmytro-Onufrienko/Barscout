import { NavigationContainer } from '@react-navigation/native';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import BottomTabs from './BottomTabs';
import OnboardingScreen from '@/screens/OnboardingScreen';

export default function RootNavigator() {
  const { status, completeOnboarding } = useOnboardingContext();

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
