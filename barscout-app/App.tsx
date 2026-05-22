import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import RootNavigator from '@/navigation/RootNavigator';
import { JournalProvider } from '@/contexts/JournalContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export default function App() {
  const scheme = useColorScheme();

  return (
    <JournalProvider>
      <FavoritesProvider>
        <RootNavigator />
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </FavoritesProvider>
    </JournalProvider>
  );
}
