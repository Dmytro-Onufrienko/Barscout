import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import RandomizerStack from '@/navigation/RandomizerStack';
import BarFinderScreen from '@/screens/BarFinderScreen';
import JournalStack from '@/navigation/JournalStack';
import SettingsScreen from '@/screens/SettingsScreen';
import type { RootTabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: { backgroundColor: theme.surface },
      }}
    >
      <Tab.Screen
        name="RandomizerTab"
        component={RandomizerStack}
        options={{
          title: 'Randomizer',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wine" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="BarFinderTab"
        component={BarFinderScreen}
        options={{
          title: 'Bar Finder',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="navigate-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="JournalTab"
        component={JournalStack}
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerShown: true,
          headerTitle: 'Налаштування',
          headerStyle: { backgroundColor: theme.background },
          headerTitleStyle: { color: theme.text },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
