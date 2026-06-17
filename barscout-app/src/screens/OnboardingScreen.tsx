import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, useTheme } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'shuffle' as const,
    title: 'Discover Cocktails',
    body: 'Shake your phone to get a random cocktail, search by name or ingredient, and browse by category.',
  },
  {
    id: '2',
    icon: 'heart' as const,
    title: 'Save & Journal',
    body: 'Favorite the cocktails you love and keep a photo journal of your tastings with ratings and notes.',
  },
  {
    id: '3',
    icon: 'beer' as const,
    title: 'Find Nearby Bars',
    body: 'Discover bars and pubs near your location, sorted by distance, and open them in Maps.',
  },
] as const;

type Props = {
  onDone: () => void;
};

export default function OnboardingScreen({ onDone }: Props) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const handleViewableChange = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      onDone();
    }
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableChange}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Ionicons name={item.icon} size={80} color={theme.primary} />
            <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.body, { color: theme.textMuted }]}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === activeIndex ? theme.primary : theme.border },
              ]}
            />
          ))}
        </View>

        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>{isLast ? 'Get Started' : 'Next'}</Text>
        </Pressable>

        {!isLast && (
          <Pressable hitSlop={12} onPress={onDone}>
            <Text style={[styles.skip, { color: theme.textMuted }]}>Skip</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
  },
  body: {
    fontSize: typography.size.md,
    textAlign: 'center',
    lineHeight: typography.size.md * 1.6,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  button: {
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  skip: {
    fontSize: typography.size.sm,
  },
});
