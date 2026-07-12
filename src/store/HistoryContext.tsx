import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TMDBMedia } from '../types/tmdb';

interface HistoryContextData {
  history: TMDBMedia[];
  addHistory: (media: TMDBMedia) => Promise<void>;
  removeHistoryItem: (id: number) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextData | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<TMDBMedia[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('@app_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  };

  const addHistory = async (media: TMDBMedia) => {
    try {
      // Remove it if it exists so we can bump it to the top
      const filtered = history.filter((item) => item.id !== media.id);
      // Keep only last 100 items
      const newList = [media, ...filtered].slice(0, 100);
      setHistory(newList);
      await AsyncStorage.setItem('@app_history', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to add to history', e);
    }
  };

  const removeHistoryItem = async (id: number) => {
    try {
      const filtered = history.filter((item) => item.id !== id);
      setHistory(filtered);
      await AsyncStorage.setItem('@app_history', JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to remove from history', e);
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem('@app_history');
  };

  return (
    <HistoryContext.Provider value={{ history, addHistory, removeHistoryItem, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within a HistoryProvider');
  return context;
}
