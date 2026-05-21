import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import RootNavigator from '@/navigation/RootNavigator';

export default function App() {
  const scheme = useColorScheme();

  return (
    <>
      <RootNavigator />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}
