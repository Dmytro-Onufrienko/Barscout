import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, useTheme } from '@/theme';
import { useJournal } from '@/contexts/JournalContext';
import Stars from '@/components/Stars';
import type { JournalStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<JournalStackParamList, 'JournalDetail'>;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function JournalDetailScreen({ route, navigation }: Props) {

  const { theme } = useTheme();
  const { entries, deleteEntry } = useJournal();

  const entry = entries.find((e) => e.id === route.params.entryId);

  if (!entry) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centered}>
          <Text style={[styles.notFound, { color: theme.textMuted }]}>Запис не знайдено</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Видалити запис?',
      `"${entry.cocktailName}" буде видалено назавжди${entry.photoUri ? ', включно з фото' : ''}.`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: async () => {
            await deleteEntry(entry.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleEdit = () => {
    navigation.navigate('JournalEntry', {
      entryId: entry.id,
      cocktailId: entry.cocktailId,
      cocktailName: entry.cocktailName,
      photoUri: entry.photoUri,
      notes: entry.notes,
      rating: entry.rating,
      createdAt: entry.createdAt,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {entry.photoUri ? (
          <Image source={{ uri: entry.photoUri }} style={styles.photo} resizeMode="cover" />
        ) : (
          <View style={[styles.noPhoto, { backgroundColor: theme.surface }]}>
            <Ionicons name="wine-outline" size={56} color={theme.textMuted} />
          </View>
        )}

        <View style={styles.body}>
          <Text style={[styles.name, { color: theme.text }]}>{entry.cocktailName}</Text>
          <Stars rating={entry.rating} />
          <Text style={[styles.date, { color: theme.textMuted }]}>{formatDate(entry.createdAt)}</Text>

          {entry.notes ? (
            <>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Нотатки</Text>
              <Text style={[styles.notes, { color: theme.text }]}>{entry.notes}</Text>
            </>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={handleEdit}
            >
              <Ionicons name="create-outline" size={18} color={theme.text} />
              <Text style={[styles.actionText, { color: theme.text }]}>Редагувати</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: theme.surface, borderColor: theme.error, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={18} color={theme.error} />
              <Text style={[styles.actionText, { color: theme.error }]}>Видалити</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { fontSize: typography.size.md },
  photo: { width: '100%', height: 280 },
  noPhoto: {
    width: '100%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  name: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
  },
  date: { fontSize: typography.size.sm },
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    marginTop: spacing.sm,
  },
  notes: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md * 1.6,
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
});
