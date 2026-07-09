import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TMDBMedia } from '../types/tmdb';

interface WatchlistContextData {
  watchlist: TMDBMedia[];
  inWatchlist: (id: number) => boolean;
  addWatchlist: (media: TMDBMedia) => Promise<void>;
  removeWatchlist: (id: number) => Promise<void>;
  clearWatchlist: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextData | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<TMDBMedia[]>([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const stored = await AsyncStorage.getItem('@app_watchlist');
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load watchlist', e);
    }
  };

  const inWatchlist = (id: number) => {
    return watchlist.some((item) => item.id === id);
  };

  const addWatchlist = async (media: TMDBMedia) => {
    try {
      if (inWatchlist(media.id)) return;
      const newList = [media, ...watchlist];
      setWatchlist(newList);
      await AsyncStorage.setItem('@app_watchlist', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to add to watchlist', e);
    }
  };

  const removeWatchlist = async (id: number) => {
    try {
      const newList = watchlist.filter((item) => item.id !== id);
      setWatchlist(newList);
      await AsyncStorage.setItem('@app_watchlist', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to remove from watchlist', e);
    }
  };

  const clearWatchlist = async () => {
    setWatchlist([]);
    await AsyncStorage.removeItem('@app_watchlist');
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, inWatchlist, addWatchlist, removeWatchlist, clearWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used within a WatchlistProvider');
  return context;
}
