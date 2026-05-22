import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { journalStorage } from '@/storage/journalStorage';
import { deletePhoto } from '@/services/photoStorage';
import type { JournalEntry } from '@/types/journalEntry';

type JournalContextValue = {
  entries: JournalEntry[];
  loading: boolean;
  saveEntry: (entry: JournalEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await journalStorage.getAll();
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  const saveEntry = useCallback(async (entry: JournalEntry) => {
    await journalStorage.save(entry);
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === entry.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = entry;
        return next;
      }
      return [entry, ...prev];
    });
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    const entry = entries.find((e) => e.id === id);
    await journalStorage.delete(id);
    if (entry?.photoUri) await deletePhoto(entry.photoUri);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, [entries]);

  return (
    <JournalContext.Provider value={{ entries, loading, saveEntry, deleteEntry, refresh }}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal(): JournalContextValue {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error('useJournal must be used within JournalProvider');
  return ctx;
}
