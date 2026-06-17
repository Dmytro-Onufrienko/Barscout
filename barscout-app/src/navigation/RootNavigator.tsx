import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import BottomTabs from './BottomTabs';
import OnboardingScreen from '@/screens/OnboardingScreen';
import {RootTabParamList} from "@/types/navigation";

const linking: LinkingOptions<RootTabParamList> = {
  prefixes: ['barscout://'],
  config: {
    screens: {
      RandomizerTab: {
        screens: {
          Search: 'share',
        },
      },
    },
  },
};

export default function RootNavigator() {
  const { status, completeOnboarding } = useOnboardingContext();

  if (status === 'loading') return null;

  if (status === 'onboarding') {
    return <OnboardingScreen onDone={completeOnboarding} />;
  }

  return (
    <NavigationContainer linking={linking}>
      <BottomTabs />
    </NavigationContainer>
  );
}
