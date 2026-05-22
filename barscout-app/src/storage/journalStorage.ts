import AsyncStorage from '@react-native-async-storage/async-storage';
import type { JournalEntry } from '@/types/journalEntry';

const KEY = '@barscout:journal_entries_v1';

export const journalStorage = {
  async getAll(): Promise<JournalEntry[]> {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async save(entry: JournalEntry): Promise<void> {
    const all = await this.getAll();
    const idx = all.findIndex((e) => e.id === entry.id);
    if (idx >= 0) all[idx] = entry;
    else all.unshift(entry);
    await AsyncStorage.setItem(KEY, JSON.stringify(all));
  },

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    const filtered = all.filter((e) => e.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(KEY);
  },
};
