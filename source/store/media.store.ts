import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CardItem } from "../types/card.type"
import {
  syncFavorites,
  syncWatchlist,
  syncHistory,
  loadUserData,
  HistoryItem,
} from "../services/firestore.service"

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
  history: HistoryItem[]
  downloads: DownloadItem[]

  // ── Mutating actions ──────────────────────────────────────
  addToWatchlist: (item: CardItem, uid?: string) => void
  removeFromWatchlist: (id: number, type: "movie" | "series", uid?: string) => void
  addToFavorites: (item: CardItem, uid?: string) => void
  removeFromFavorites: (id: number, type: "movie" | "series", uid?: string) => void
  addToHistory: (item: CardItem, uid?: string) => void
  clearHistory: (uid?: string) => void

  // ── Download actions ──────────────────────────────────────
  addDownload: (item: DownloadItem) => void
  removeDownload: (id: number) => void
  updateDownloadProgress: (id: number, progress: number, status: "completed" | "downloading") => void
  startDownloadSimulation: (item: Omit<DownloadItem, "progress" | "status">) => void

  // ── Cloud sync helpers ────────────────────────────────────
  loadFromCloud: (uid: string) => Promise<void>
  clearUserData: () => void
}

export const useMediaStore = create<MediaState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      favorites: [],
      history: [],
      downloads: [
        {
          id: 27205,
          title: "Inception",
          poster: "/o07wHQadZ56XMjR6gRgdcoys5XU.jpg",
          size: "1.4 GB",
          progress: 1.0,
          status: "completed",
          type: "movie",
          duration: "2h 28m",
        },
        {
          id: 1396,
          title: "Breaking Bad",
          poster: "/ztkUQv63U7s68Esfv7YJNJsu9GC.jpg",
          size: "850 MB",
          progress: 1.0,
          status: "completed",
          type: "series",
          duration: "S1 E1",
        },
      ],

      // ── Watchlist ──────────────────────────────────────────
      addToWatchlist: (item, uid) => {
        const list = get().watchlist
        if (!list.some((i) => i.id === item.id && i.type === item.type)) {
          const updated = [item, ...list]
          set({ watchlist: updated })
          if (uid) syncWatchlist(uid, updated)
        }
      },

      removeFromWatchlist: (id, type, uid) => {
        const updated = get().watchlist.filter((i) => !(i.id === id && i.type === type))
        set({ watchlist: updated })
        if (uid) syncWatchlist(uid, updated)
      },

      // ── Favorites ──────────────────────────────────────────
      addToFavorites: (item, uid) => {
        const list = get().favorites
        if (!list.some((i) => i.id === item.id && i.type === item.type)) {
          const updated = [item, ...list]
          set({ favorites: updated })
          if (uid) syncFavorites(uid, updated)
        }
      },

      removeFromFavorites: (id, type, uid) => {
        const updated = get().favorites.filter((i) => !(i.id === id && i.type === type))
        set({ favorites: updated })
        if (uid) syncFavorites(uid, updated)
      },

      // ── History ────────────────────────────────────────────
      addToHistory: (item, uid) => {
        const existing = get().history.filter(
          (h) => !(h.item.id === item.id && h.item.type === item.type)
        )
        const updated = [{ item, watchedAt: Date.now() }, ...existing].slice(0, 100)
        set({ history: updated })
        if (uid) syncHistory(uid, updated)
      },

      clearHistory: (uid) => {
        set({ history: [] })
        if (uid) syncHistory(uid, [])
      },

      // ── Cloud load (called on login) ───────────────────────
      loadFromCloud: async (uid) => {
        const data = await loadUserData(uid)
        set({
          favorites: data.favorites,
          watchlist: data.watchlist,
          history: data.history,
        })
      },

      // ── Clear on logout ────────────────────────────────────
      clearUserData: () => {
        set({ favorites: [], watchlist: [], history: [] })
      },

      // ── Downloads (local only) ─────────────────────────────
      addDownload: (item) => {
        const list = get().downloads
        if (!list.some((d) => d.id === item.id)) {
          set({ downloads: [item, ...list] })
        }
      },

      removeDownload: (id) => {
        set({ downloads: get().downloads.filter((d) => d.id !== id) })
      },

      updateDownloadProgress: (id, progress, status) => {
        set({
          downloads: get().downloads.map((d) =>
            d.id === id ? { ...d, progress, status } : d
          ),
        })
      },

      startDownloadSimulation: (item) => {
        const list = get().downloads
        if (list.some((d) => d.id === item.id)) return
        const newDownload: DownloadItem = { ...item, progress: 0, status: "downloading" }
        set({ downloads: [newDownload, ...list] })
        let current = 0
        const interval = setInterval(() => {
          current += 0.2
          if (current >= 1.0) {
            get().updateDownloadProgress(item.id, 1.0, "completed")
            clearInterval(interval)
          } else {
            get().updateDownloadProgress(item.id, current, "downloading")
          }
        }, 800)
      },
    }),
    {
      name: "fabprime-media-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
