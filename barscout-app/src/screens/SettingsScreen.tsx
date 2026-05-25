import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, typography, useTheme } from '@/theme';
import type { ColorMode } from '@/theme/ThemeContext';

const COLOR_MODES: { value: ColorMode; label: string; icon: string }[] = [
  { value: 'auto',  label: 'Системна', icon: '⚙️' },
  { value: 'light', label: 'Світла',   icon: '☀️' },
  { value: 'dark',  label: 'Темна',    icon: '🌙' },
];

export default function SettingsScreen() {
  const { theme, colorMode, setColorMode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
              {selected && (
                <Text style={[styles.checkmark, { color: theme.primary }]}>✓</Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
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
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  label: {
    flex: 1,
    fontSize: typography.size.md,
  },
  checkmark: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
});
