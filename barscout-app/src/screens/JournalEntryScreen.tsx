import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { spacing, typography, useTheme } from '@/theme';
import { useJournal } from '@/contexts/JournalContext';
import { savePhotoPermanently } from '@/services/photoStorage';
import type { JournalStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<JournalStackParamList, 'JournalEntry'>;

const NOTES_MAX = 500;

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={starStyles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onChange(star)} hitSlop={8}>
          <Text style={starStyles.star}>{star <= value ? '⭐' : '☆'}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs },
  star: { fontSize: 28 },
});

export default function JournalEntryScreen({ route, navigation }: Props) {

  const { theme } = useTheme();

  const { saveEntry } = useJournal();
  const [cocktailName, setCocktailName] = useState(route.params.cocktailName ?? '');
  const [notes, setNotes] = useState(route.params.notes ?? '');
  const [rating, setRating] = useState(route.params.rating ?? 0);
  const [photoUri, setPhotoUri] = useState(route.params.photoUri);
  const [saving, setSaving] = useState(false);

  const isValid = cocktailName.trim().length > 0 && rating > 0;

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      const permanentUri = photoUri ? await savePhotoPermanently(photoUri) : undefined;
      await saveEntry({
        id: route.params.entryId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        cocktailId: route.params.cocktailId,
        cocktailName: cocktailName.trim(),
        photoUri: permanentUri,
        rating,
        notes,
        createdAt: new Date().toISOString(),
      });
      navigation.popToTop();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {photoUri ? (
            <View style={styles.photoWrap}>
              <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
              <Pressable
                style={[styles.replacePhoto, { backgroundColor: theme.surface }]}
                onPress={() => navigation.navigate('Camera')}
              >
                <Text style={[styles.replacePhotoText, { color: theme.text }]}>
                  🔄 Замінити фото
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[styles.addPhoto, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => navigation.navigate('Camera')}
            >
              <Text style={styles.addPhotoEmoji}>📷</Text>
              <Text style={[styles.addPhotoText, { color: theme.textMuted }]}>
                Зробити фото
              </Text>
            </Pressable>
          )}

          <View style={styles.fields}>
            <Text style={[styles.label, { color: theme.textMuted }]}>Назва коктейлю *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={cocktailName}
              onChangeText={setCocktailName}
              placeholder="Margarita, Negroni…"
              placeholderTextColor={theme.textMuted}
              returnKeyType="next"
            />

            <Text style={[styles.label, { color: theme.textMuted }]}>Рейтинг *</Text>
            <StarRating value={rating} onChange={setRating} />

            <View style={styles.notesHeader}>
              <Text style={[styles.label, { color: theme.textMuted }]}>Нотатки</Text>
              <Text style={[styles.counter, { color: theme.textMuted }]}>
                {notes.length}/{NOTES_MAX}
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                styles.notesInput,
                { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
              ]}
              value={notes}
              onChangeText={(t) => setNotes(t.slice(0, NOTES_MAX))}
              placeholder="Смак, аромат, враження…"
              placeholderTextColor={theme.textMuted}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
          <Pressable
            style={[styles.cancelButton, { borderColor: theme.border }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelText, { color: theme.text }]}>Скасувати</Text>
          </Pressable>
          <Pressable
            style={[
              styles.saveButton,
              { backgroundColor: isValid ? theme.primary : theme.surface },
            ]}
            onPress={handleSave}
            disabled={!isValid || saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={[styles.saveText, { color: isValid ? '#fff' : theme.textMuted }]}>
                Зберегти
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    paddingBottom: spacing.xl,
  },
  photoWrap: {
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 240,
  },
  replacePhoto: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  replacePhotoText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  addPhoto: {
    margin: spacing.md,
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  addPhotoEmoji: { fontSize: 36 },
  addPhotoText: { fontSize: typography.size.md },
  fields: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    marginBottom: -spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: typography.size.md,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -spacing.xs,
  },
  notesInput: {
    minHeight: 100,
    paddingTop: spacing.sm,
  },
  counter: {
    fontSize: typography.size.xs,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.sm + 4,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  saveButton: {
    flex: 2,
    paddingVertical: spacing.sm + 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
