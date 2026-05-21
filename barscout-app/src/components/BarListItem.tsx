import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import type { Bar } from '@/types/bar';

type Props = {
  bar: Bar;
  onPress: () => void;
};

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function BarListItem({ bar, onPress }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.surface, opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.background }]}>
        <Ionicons name="beer-outline" size={22} color={theme.primary} />
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {bar.name}
        </Text>
        {bar.tags.address || bar.tags['addr:street'] ? (
          <Text style={[styles.address, { color: theme.textMuted }]} numberOfLines={1}>
            {bar.tags.address ?? bar.tags['addr:street']}
          </Text>
        ) : null}
      </View>

      {bar.distanceMeters !== undefined && (
        <Text style={[styles.distance, { color: theme.textMuted }]}>
          {formatDistance(bar.distanceMeters)}
        </Text>
      )}

      <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  address: {
    fontSize: typography.size.sm,
  },
  distance: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});
