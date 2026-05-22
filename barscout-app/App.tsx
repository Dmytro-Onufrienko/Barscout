import { StatusBar } from 'expo-status-bar';
import RootNavigator from '@/navigation/RootNavigator';
import { ThemeProvider, useTheme } from '@/theme';
import { JournalProvider } from '@/contexts/JournalContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

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
      <JournalProvider>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </JournalProvider>
    </ThemeProvider>
  );
}
