import { useState, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, typography, useTheme } from '@/theme';
import { useLocation } from '@/hooks/useLocation';
import { getNearbyBars } from '@/services/overpassApi';
import BarListItem from '@/components/BarListItem';
import ErrorView from '@/components/ErrorView';
import { openInMaps } from '@/utils/mapLinking';
import type { Bar } from '@/types/bar';

const RADIUS_OPTIONS = [500, 1000, 2000, 5000] as const;
type Radius = (typeof RADIUS_OPTIONS)[number];

function formatRadius(r: Radius): string {
  return r < 1000 ? `${r} m` : `${r / 1000} km`;
}

export default function BarFinderScreen() {

  const { theme } = useTheme();
  const { state, requestLocation, openSettings } = useLocation();

  const [bars, setBars] = useState<Bar[]>([]);
  const [loadingBars, setLoadingBars] = useState(false);
  const [barsError, setBarsError] = useState<string | null>(null);
  const [radius, setRadius] = useState<Radius>(1000);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBars = useCallback(
    async (lat: number, lon: number, r: Radius, isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoadingBars(true);
      setBarsError(null);
      try {
        const data = await getNearbyBars(lat, lon, r);
        setBars(data);
      } catch (e) {
        setBarsError((e as Error).message);
      } finally {
        setLoadingBars(false);
        setRefreshing(false);
      }
    },
    [],
  );

  const handleFind = useCallback(async () => {
    await requestLocation();
  }, [requestLocation]);

  // fetch bars once location arrives
  const handleRadiusChange = useCallback(
    (r: Radius) => {
      setRadius(r);
      if (state.status === 'success') {
        fetchBars(state.coords.latitude, state.coords.longitude, r);
      }
    },
    [state, fetchBars],
  );

  useEffect(() => {
    if (state.status === 'success') {
      fetchBars(state.coords.latitude, state.coords.longitude, radius);
    }
  }, [state.status]);

  const renderContent = () => {
    if (state.status === 'idle') {
      return (
        <View style={styles.centered}>
          <Text style={styles.emoji}>🍺</Text>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            Знайди бари поруч з тобою
          </Text>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={handleFind}
          >
            <Text style={styles.primaryButtonText}>🔍 Знайти бари</Text>
          </Pressable>
        </View>
      );
    }

    if (state.status === 'requesting') {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            Отримуємо локацію…
          </Text>
        </View>
      );
    }

    if (state.status === 'denied') {
      return (
        <View style={styles.centered}>
          <Text style={styles.emoji}>📍</Text>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            Потрібен доступ до геолокації для пошуку барів
          </Text>
          {state.canAskAgain ? (
            <Pressable
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={handleFind}
            >
              <Text style={styles.primaryButtonText}>Дозволити</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={openSettings}
            >
              <Text style={styles.primaryButtonText}>Відкрити налаштування</Text>
            </Pressable>
          )}
        </View>
      );
    }

    if (state.status === 'error') {
      return <ErrorView message={state.message} onRetry={handleFind} />;
    }

    if (loadingBars) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.hint, { color: theme.textMuted }]}>Шукаємо бари…</Text>
        </View>
      );
    }

    if (barsError) {
      return (
        <ErrorView
          message={barsError}
          onRetry={() =>
            fetchBars(state.coords.latitude, state.coords.longitude, radius)
          }
        />
      );
    }

    return (
      <FlatList
        data={bars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BarListItem
            bar={item}
            onPress={() => openInMaps(item.lat, item.lon, item.name)}
          />
        )}
        initialNumToRender={10}
        windowSize={5}
        removeClippedSubviews
        refreshing={refreshing}
        onRefresh={() =>
          fetchBars(state.coords.latitude, state.coords.longitude, radius, true)
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emoji}>🏜️</Text>
            <Text style={[styles.hint, { color: theme.textMuted }]}>
              Барів поблизу не знайдено
            </Text>
            <Pressable
              style={[styles.secondaryButton, { borderColor: theme.border }]}
              onPress={() => handleRadiusChange(5000)}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
                Збільшити радіус до 5 km
              </Text>
            </Pressable>
          </View>
        }
        contentContainerStyle={bars.length === 0 ? styles.emptyContainer : undefined}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {state.status === 'success' && (
        <View style={[styles.radiusBar, { borderBottomColor: theme.border }]}>
          {RADIUS_OPTIONS.map((r) => (
            <Pressable
              key={r}
              style={[
                styles.radiusChip,
                {
                  backgroundColor: r === radius ? theme.primary : theme.surface,
                  borderColor: r === radius ? theme.primary : theme.border,
                },
              ]}
              onPress={() => handleRadiusChange(r)}
            >
              <Text
                style={[
                  styles.radiusChipText,
                  { color: r === radius ? '#fff' : theme.text },
                ]}
              >
                {formatRadius(r)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
  },
  emoji: {
    fontSize: 48,
  },
  hint: {
    fontSize: typography.size.md,
    textAlign: 'center',
    lineHeight: typography.size.md * 1.5,
  },
  primaryButton: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    marginTop: spacing.xs,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  secondaryButton: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: spacing.xs,
  },
  secondaryButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  radiusBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  radiusChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
  },
  radiusChipText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});
