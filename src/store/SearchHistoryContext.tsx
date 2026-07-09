import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchHistoryData {
  recentSearches: string[];
  addSearch: (query: string) => Promise<void>;
  clearSearches: () => Promise<void>;
}

const SearchHistoryContext = createContext<SearchHistoryData | undefined>(undefined);

export function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    loadSearches();
  }, []);

  const loadSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem('@app_search_history');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load search history', e);
    }
  };

  const addSearch = async (query: string) => {
    try {
      const trimmed = query.trim();
      if (!trimmed) return;
      
      const filtered = recentSearches.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      const newList = [trimmed, ...filtered].slice(0, 10); // Keep last 10
      setRecentSearches(newList);
      await AsyncStorage.setItem('@app_search_history', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to add to search history', e);
    }
  };

  const clearSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem('@app_search_history');
  };

  return (
    <SearchHistoryContext.Provider value={{ recentSearches, addSearch, clearSearches }}>
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);
  if (!context) throw new Error('useSearchHistory must be used within a SearchHistoryProvider');
  return context;
}
