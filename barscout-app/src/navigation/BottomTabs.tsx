import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import RandomizerScreen from '@/screens/RandomizerScreen';
import BarFinderScreen from '@/screens/BarFinderScreen';
import JournalScreen from '@/screens/JournalScreen';
import type { RootTabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabs() {
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];

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
        component={RandomizerScreen}
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
        component={JournalScreen}
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
