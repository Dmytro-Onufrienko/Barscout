import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, useTheme } from '@/theme';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import type { ColorMode } from '@/theme/ThemeContext';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const COLOR_MODES: { value: ColorMode; label: string; icon: IoniconName }[] = [
  { value: 'auto',  label: 'Системна', icon: 'settings-outline' },
  { value: 'light', label: 'Світла',   icon: 'sunny-outline' },
  { value: 'dark',  label: 'Темна',    icon: 'moon-outline' },
];

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { colorMode, setColorMode } = useTheme();
  const { resetOnboarding } = useOnboardingContext();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Тема</Text>
        <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {COLOR_MODES.map((item, index) => {
            const selected = colorMode === item.value;
            const isLast = index === COLOR_MODES.length - 1;
            return (
              <Pressable
                key={item.value}
                style={[
                  styles.row,
                  !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
                ]}
                onPress={() => setColorMode(item.value)}
              >
                <Ionicons name={item.icon} size={20} color={theme.textMuted} style={styles.icon} />
                <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
                {selected && (
                  <Ionicons name="checkmark" size={18} color={theme.primary} />
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Загальне</Text>
        <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Pressable style={styles.row} onPress={resetOnboarding}>
            <Ionicons name="refresh-outline" size={20} color={theme.textMuted} style={styles.icon} />
            <Text style={[styles.label, { color: theme.text }]}>Переглянути вступ</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Про застосунок</Text>
        <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.row, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border }]}>
            <Ionicons name="beer-outline" size={20} color={theme.textMuted} style={styles.icon} />
            <Text style={[styles.label, { color: theme.text }]}>Barscout</Text>
            <Text style={[styles.value, { color: theme.textMuted }]}>v1.0.0</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="globe-outline" size={20} color={theme.textMuted} style={styles.icon} />
            <Text style={[styles.label, { color: theme.text }]}>Дані</Text>
            <Text style={[styles.value, { color: theme.textMuted }]}>TheCocktailDB · OpenStreetMap</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    marginTop: spacing.lg,
  },
  group: {
    marginHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    gap: spacing.sm,
  },
  icon: {
    width: 28,
    textAlign: 'center',
  },
  label: {
    flex: 1,
    fontSize: typography.size.md,
  },
  value: {
    fontSize: typography.size.sm,
  },
});
