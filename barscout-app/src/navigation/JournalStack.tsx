import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/theme';
import JournalScreen from '@/screens/JournalScreen';
import CameraScreen from '@/screens/CameraScreen';
import JournalEntryScreen from '@/screens/JournalEntryScreen';
import JournalDetailScreen from '@/screens/JournalDetailScreen';
import type { JournalStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<JournalStackParamList>();

export default function JournalStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="Journal"
        component={JournalScreen}
        options={{ title: 'Journal' }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JournalEntry"
        component={JournalEntryScreen}
        options={{ title: 'New Entry' }}
      />
      <Stack.Screen
        name="JournalDetail"
        component={JournalDetailScreen}
        options={{ title: 'Entry' }}
      />
    </Stack.Navigator>
  );
}
