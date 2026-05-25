import { StatusBar } from 'expo-status-bar';
import RootNavigator from '@/navigation/RootNavigator';
import { ThemeProvider, useTheme } from '@/theme';
import { JournalProvider } from '@/contexts/JournalContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

function AppContent() {
  const { scheme } = useTheme();
  return (
    <>
      <RootNavigator />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <OnboardingProvider>
        <JournalProvider>
          <FavoritesProvider>
            <AppContent />
          </FavoritesProvider>
        </JournalProvider>
      </OnboardingProvider>
    </ThemeProvider>
  );
}
