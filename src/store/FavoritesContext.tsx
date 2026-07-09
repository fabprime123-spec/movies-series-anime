import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TMDBMedia } from '../types/tmdb';

interface FavoritesContextData {
  favorites: TMDBMedia[];
  addFavorite: (media: TMDBMedia) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextData | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<TMDBMedia[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('@favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
  };

  const addFavorite = async (media: TMDBMedia) => {
    try {
      const updated = [...favorites, media];
      setFavorites(updated);
      await AsyncStorage.setItem('@favorites', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save favorite', e);
    }
  };

  const removeFavorite = async (id: number) => {
    try {
      const updated = favorites.filter(fav => fav.id !== id);
      setFavorites(updated);
      await AsyncStorage.setItem('@favorites', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove favorite', e);
    }
  };

  const isFavorite = (id: number) => {
    return favorites.some(fav => fav.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
