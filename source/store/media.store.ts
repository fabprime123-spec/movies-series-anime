import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CardItem } from "../types/card.type"

export interface DownloadItem {
  id: number
  title: string
  poster: string
  size: string
  progress: number
  status: "completed" | "downloading"
  type: "movie" | "series"
  duration?: string
}

interface MediaState {
  watchlist: CardItem[]
  favorites: CardItem[]
  downloads: DownloadItem[]
  addToWatchlist: (item: CardItem) => void
  removeFromWatchlist: (id: number, type: "movie" | "series") => void
  addToFavorites: (item: CardItem) => void
  removeFromFavorites: (id: number, type: "movie" | "series") => void
  addDownload: (item: DownloadItem) => void
  removeDownload: (id: number) => void
  updateDownloadProgress: (id: number, progress: number, status: "completed" | "downloading") => void
  startDownloadSimulation: (item: Omit<DownloadItem, "progress" | "status">) => void
}

export const useMediaStore = create<MediaState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      favorites: [],
      // Initialize with two premium mock downloads so the screen doesn't start empty
      downloads: [
        {
          id: 27205,
          title: "Inception",
          poster: "/o07wHQadZ56XMjR6gRgdcoys5XU.jpg",
          size: "1.4 GB",
          progress: 1.0,
          status: "completed",
          type: "movie",
          duration: "2h 28m"
        },
        {
          id: 1396,
          title: "Breaking Bad",
          poster: "/ztkUQv63U7s68Esfv7YJNJsu9GC.jpg",
          size: "850 MB",
          progress: 1.0,
          status: "completed",
          type: "series",
          duration: "S1 E1"
        }
      ],

      addToWatchlist: (item) => {
        const list = get().watchlist
        if (!list.some(i => i.id === item.id && i.type === item.type)) {
          set({ watchlist: [item, ...list] })
        }
      },

      removeFromWatchlist: (id, type) => {
        set({
          watchlist: get().watchlist.filter(i => !(i.id === id && i.type === type))
        })
      },

      addToFavorites: (item) => {
        const list = get().favorites
        if (!list.some(i => i.id === item.id && i.type === item.type)) {
          set({ favorites: [item, ...list] })
        }
      },

      removeFromFavorites: (id, type) => {
        set({
          favorites: get().favorites.filter(i => !(i.id === id && i.type === type))
        })
      },

      addDownload: (item) => {
        const list = get().downloads
        if (!list.some(d => d.id === item.id)) {
          set({ downloads: [item, ...list] })
        }
      },

      removeDownload: (id) => {
        set({
          downloads: get().downloads.filter(d => d.id !== id)
        })
      },

      updateDownloadProgress: (id, progress, status) => {
        set({
          downloads: get().downloads.map(d => 
            d.id === id ? { ...d, progress, status } : d
          )
        })
      },

      startDownloadSimulation: (item) => {
        const list = get().downloads
        if (list.some(d => d.id === item.id)) return // Already in list

        // Add item as downloading with 0 progress
        const newDownload: DownloadItem = {
          ...item,
          progress: 0,
          status: "downloading"
        }
        set({ downloads: [newDownload, ...list] })

        let currentProgress = 0
        const interval = setInterval(() => {
          currentProgress += 0.20 // 20% steps
          if (currentProgress >= 1.0) {
            get().updateDownloadProgress(item.id, 1.0, "completed")
            clearInterval(interval)
          } else {
            get().updateDownloadProgress(item.id, currentProgress, "downloading")
          }
        }, 800) // Update every 800ms
      }
    }),
    {
      name: "fabprime-media-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)
