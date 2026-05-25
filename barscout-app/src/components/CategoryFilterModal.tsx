import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, typography, useTheme } from '@/theme';
import { getCategories } from '@/services/cocktailApi';

type Props = {
  visible: boolean;
  selected: string | null;
  onSelect: (category: string | null) => void;
  onClose: () => void;
};

export default function CategoryFilterModal({ visible, selected, onSelect, onClose }: Props) {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>Filter by Category</Text>
          <Pressable hitSlop={12} onPress={onClose}>
            <Text style={[styles.close, { color: theme.primary }]}>Done</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" color={theme.primary} />
        ) : (
          <FlatList
            data={[null, ...categories]}
            keyExtractor={(item) => item ?? '__all__'}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => {
              const isSelected = item === selected;
              const isLast = index === categories.length;
              return (
                <Pressable
                  style={[
                    styles.row,
                    { borderBottomColor: theme.border },
                    !isLast && styles.rowBorder,
                  ]}
                  onPress={() => { onSelect(item); onClose(); }}
                >
                  <Text style={[styles.rowText, { color: theme.text }]}>
                    {item ?? 'All Categories'}
                  </Text>
                  {isSelected && (
                    <Text style={[styles.check, { color: theme.primary }]}>✓</Text>
                  )}
                </Pressable>
              );
            }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  close: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  loader: { flex: 1 },
  list: { paddingHorizontal: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    gap: spacing.sm,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    flex: 1,
    fontSize: typography.size.md,
  },
  check: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
});
