import React, { createContext, useContext, useState, useEffect } from 'react';

export interface QRHistoryItem {
  id: string;
  name: string;
  type: 'url' | 'text' | 'email' | 'phone' | 'vcard';
  data: string;
  fgColor: string;
  bgColor: string;
  logoUrl?: string;
  createdAt: number;
}

interface HistoryContextType {
  history: QRHistoryItem[];
  addToHistory: (item: Omit<QRHistoryItem, 'id' | 'createdAt'>) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  renameItem: (id: string, newName: string) => void;
  searchHistory: (query: string) => QRHistoryItem[];
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'qr-history';

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<QRHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (item: Omit<QRHistoryItem, 'id' | 'createdAt'>) => {
    const newItem: QRHistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const renameItem = (id: string, newName: string) => {
    setHistory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
  };

  const searchHistory = (query: string): QRHistoryItem[] => {
    if (!query.trim()) return history;
    const lower = query.toLowerCase();
    return history.filter(
      item =>
        item.name.toLowerCase().includes(lower) ||
        item.data.toLowerCase().includes(lower) ||
        item.type.toLowerCase().includes(lower)
    );
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
        renameItem,
        searchHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
