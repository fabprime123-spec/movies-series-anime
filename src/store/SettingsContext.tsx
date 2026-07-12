import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setGlobalBannedCountries } from '../api/tmdb';

export interface SettingsData {
  appLanguage: string;
  audioLanguage: string;
  excludedCountries: string[];
  autoplayTrailers: boolean;
  wifiOnly: boolean;
  notifications: boolean;
  videoQuality: 'SD' | 'HD' | '4K';
  filterLanguage: string;
  selectedPlatforms: string[];
  filterYear: string;
  subtitleSize: 'Small' | 'Medium' | 'Large';
  maturityRating: 'All' | 'PG' | 'PG-13' | 'R';
  dataSaver: boolean;
  hapticFeedback: boolean;
  hideEmptySeasons: boolean;
  autoClearHistory: boolean;
  offlineMode: boolean;
  galleryViewMode: 'vertical' | 'horizontal';

  updateSetting: (key: keyof Omit<SettingsData, 'updateSetting' | 'clearSettings'>, value: any) => Promise<void>;
  clearSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: Omit<SettingsData, 'updateSetting' | 'clearSettings'> = {
  appLanguage: 'English',
  audioLanguage: 'English',
  excludedCountries: [],
  autoplayTrailers: true,
  wifiOnly: false,
  notifications: true,
  videoQuality: 'HD',
  filterLanguage: 'All',
  selectedPlatforms: [],
  filterYear: 'All',
  subtitleSize: 'Medium',
  maturityRating: 'All',
  dataSaver: false,
  hapticFeedback: true,
  hideEmptySeasons: true,
  autoClearHistory: false,
  offlineMode: false,
  galleryViewMode: 'horizontal',
};

const SettingsContext = createContext<SettingsData | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Omit<SettingsData, 'updateSetting' | 'clearSettings'>>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('@app_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        // Restore global interceptor for first excluded country if any
        if (parsed.excludedCountries && parsed.excludedCountries.length > 0) {
          setGlobalBannedCountries(parsed.excludedCountries);
        }
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  };

  const updateSetting = async (key: keyof Omit<SettingsData, 'updateSetting' | 'clearSettings'>, value: any) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      // If we change excluded countries, update global interceptor to first one
      if (key === 'excludedCountries') {
        const list = value as string[];
        setGlobalBannedCountries(list);
      }

      await AsyncStorage.setItem('@app_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save setting', e);
    }
  };

  const clearSettings = async () => {
    try {
      setSettings(DEFAULT_SETTINGS);
      await AsyncStorage.removeItem('@app_settings');
      setGlobalBannedCountries([]);
    } catch (e) {
      console.error('Failed to clear settings', e);
    }
  };

  return (
    <SettingsContext.Provider value={{ ...settings, updateSetting, clearSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
