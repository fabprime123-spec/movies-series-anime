import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TMDBMedia } from '../types/tmdb';

interface DownloadsContextData {
  downloads: TMDBMedia[];
  inDownloads: (id: number) => boolean;
  addDownload: (media: TMDBMedia) => Promise<void>;
  removeDownload: (id: number) => Promise<void>;
  clearDownloads: () => Promise<void>;
}

const DownloadsContext = createContext<DownloadsContextData | undefined>(undefined);

export function DownloadsProvider({ children }: { children: React.ReactNode }) {
  const [downloads, setDownloads] = useState<TMDBMedia[]>([]);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      const stored = await AsyncStorage.getItem('@app_downloads');
      if (stored) {
        setDownloads(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load downloads', e);
    }
  };

  const inDownloads = (id: number) => {
    return downloads.some((item) => item.id === id);
  };

  const addDownload = async (media: TMDBMedia) => {
    try {
      if (inDownloads(media.id)) return;
      const newList = [media, ...downloads];
      setDownloads(newList);
      await AsyncStorage.setItem('@app_downloads', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to add to downloads', e);
    }
  };

  const removeDownload = async (id: number) => {
    try {
      const newList = downloads.filter((item) => item.id !== id);
      setDownloads(newList);
      await AsyncStorage.setItem('@app_downloads', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to remove from downloads', e);
    }
  };

  const clearDownloads = async () => {
    setDownloads([]);
    await AsyncStorage.removeItem('@app_downloads');
  };

  return (
    <DownloadsContext.Provider value={{ downloads, inDownloads, addDownload, removeDownload, clearDownloads }}>
      {children}
    </DownloadsContext.Provider>
  );
}

export function useDownloads() {
  const context = useContext(DownloadsContext);
  if (!context) throw new Error('useDownloads must be used within a DownloadsProvider');
  return context;
}
