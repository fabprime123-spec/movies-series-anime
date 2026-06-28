import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface SettingsState {
  appLanguage: string
  audioLanguage: string
  excludedCountries: string[]
  autoplayTrailers: boolean
  wifiOnly: boolean
  notifications: boolean
  videoQuality: "SD" | "HD" | "4K"
  filterLanguage: string
  selectedPlatforms: string[]
  filterYear: string
  // New features
  subtitleSize: "Small" | "Medium" | "Large"
  maturityRating: "All" | "PG" | "PG-13" | "R"
  dataSaver: boolean
  hapticFeedback: boolean
  setAppLanguage: (lang: string) => void
  setAudioLanguage: (lang: string) => void
  toggleCountryExclusion: (countryCode: string) => void
  setAutoplayTrailers: (val: boolean) => void
  setWifiOnly: (val: boolean) => void
  setNotifications: (val: boolean) => void
  setVideoQuality: (quality: "SD" | "HD" | "4K") => void
  setFilterLanguage: (lang: string) => void
  setSelectedPlatforms: (platforms: string[]) => void
  togglePlatformSelection: (platform: string) => void
  setFilterYear: (year: string) => void
  // New setters
  setSubtitleSize: (size: "Small" | "Medium" | "Large") => void
  setMaturityRating: (rating: "All" | "PG" | "PG-13" | "R") => void
  setDataSaver: (val: boolean) => void
  setHapticFeedback: (val: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      appLanguage: "English",
      audioLanguage: "English",
      excludedCountries: [],
      autoplayTrailers: true,
      wifiOnly: true,
      notifications: true,
      videoQuality: "HD",
      filterLanguage: "All",
      selectedPlatforms: ["netflix", "disney", "prime", "apple"],
      filterYear: "All",
      // New defaults
      subtitleSize: "Medium",
      maturityRating: "All",
      dataSaver: false,
      hapticFeedback: true,

      setAppLanguage: (lang) => set({ appLanguage: lang }),
      setAudioLanguage: (lang) => set({ audioLanguage: lang }),
      toggleCountryExclusion: (countryCode) => {
        const list = get().excludedCountries
        if (list.includes(countryCode)) {
          set({ excludedCountries: list.filter((c) => c !== countryCode) })
        } else {
          set({ excludedCountries: [...list, countryCode] })
        }
      },
      setAutoplayTrailers: (val) => set({ autoplayTrailers: val }),
      setWifiOnly: (val) => set({ wifiOnly: val }),
      setNotifications: (val) => set({ notifications: val }),
      setVideoQuality: (quality) => set({ videoQuality: quality }),
      setFilterLanguage: (lang) => set({ filterLanguage: lang }),
      setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
      togglePlatformSelection: (platform) => {
        const list = get().selectedPlatforms
        if (list.includes(platform)) {
          set({ selectedPlatforms: list.filter((p) => p !== platform) })
        } else {
          set({ selectedPlatforms: [...list, platform] })
        }
      },
      setFilterYear: (year) => set({ filterYear: year }),
      // New setters
      setSubtitleSize: (size) => set({ subtitleSize: size }),
      setMaturityRating: (rating) => set({ maturityRating: rating }),
      setDataSaver: (val) => set({ dataSaver: val }),
      setHapticFeedback: (val) => set({ hapticFeedback: val }),
    }),
    {
      name: "fabprime-settings-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)
