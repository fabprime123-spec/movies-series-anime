import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TMDBMedia } from '../types/tmdb';

interface CollectionsContextData {
  collections: TMDBMedia[];
  inCollections: (id: number) => boolean;
  addCollection: (media: TMDBMedia) => Promise<void>;
  removeCollection: (id: number) => Promise<void>;
  clearCollections: () => Promise<void>;
}

const CollectionsContext = createContext<CollectionsContextData | undefined>(undefined);

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
  const [collections, setCollections] = useState<TMDBMedia[]>([]);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const stored = await AsyncStorage.getItem('@app_collections');
      if (stored) {
        setCollections(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load collections', e);
    }
  };

  const inCollections = (id: number) => {
    return collections.some((item) => item.id === id);
  };

  const addCollection = async (media: TMDBMedia) => {
    try {
      if (inCollections(media.id)) return;
      const newList = [media, ...collections];
      setCollections(newList);
      await AsyncStorage.setItem('@app_collections', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to add to collections', e);
    }
  };

  const removeCollection = async (id: number) => {
    try {
      const newList = collections.filter((item) => item.id !== id);
      setCollections(newList);
      await AsyncStorage.setItem('@app_collections', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to remove from collections', e);
    }
  };

  const clearCollections = async () => {
    setCollections([]);
    await AsyncStorage.removeItem('@app_collections');
  };

  return (
    <CollectionsContext.Provider value={{ collections, inCollections, addCollection, removeCollection, clearCollections }}>
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (!context) throw new Error('useCollections must be used within a CollectionsProvider');
  return context;
}
