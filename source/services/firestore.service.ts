// ─────────────────────────────────────────────────────────────
//  FIRESTORE SERVICE
//  All read/write operations to the cloud database live here.
//  Structure in Firestore:
//    users/{uid}/favorites   (array)
//    users/{uid}/watchlist   (array)
//    users/{uid}/history     (array)
// ─────────────────────────────────────────────────────────────
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"
import { firestore } from "../config/firebase"
import { CardItem } from "../types/card.type"

export interface HistoryItem {
  item: CardItem
  watchedAt: number // unix timestamp
}

export interface UserData {
  favorites: CardItem[]
  watchlist: CardItem[]
  history: HistoryItem[]
}

// ── Load all user data from Firestore ──────────────────────────
export async function loadUserData(uid: string): Promise<UserData> {
  try {
    const ref = doc(firestore, "users", uid)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      const d = snap.data()
      return {
        favorites: d.favorites ?? [],
        watchlist: d.watchlist ?? [],
        history: d.history ?? [],
      }
    }
    // First login — create the user document with empty arrays
    await setDoc(ref, {
      favorites: [],
      watchlist: [],
      history: [],
      createdAt: serverTimestamp(),
    })
    return { favorites: [], watchlist: [], history: [] }
  } catch (e) {
    console.error("Firestore loadUserData error:", e)
    return { favorites: [], watchlist: [], history: [] }
  }
}

// ── Sync favorites ─────────────────────────────────────────────
export async function syncFavorites(uid: string, favorites: CardItem[]) {
  try {
    const ref = doc(firestore, "users", uid)
    await updateDoc(ref, { favorites, updatedAt: serverTimestamp() })
  } catch (e) {
    console.error("Firestore syncFavorites error:", e)
  }
}

// ── Sync watchlist ─────────────────────────────────────────────
export async function syncWatchlist(uid: string, watchlist: CardItem[]) {
  try {
    const ref = doc(firestore, "users", uid)
    await updateDoc(ref, { watchlist, updatedAt: serverTimestamp() })
  } catch (e) {
    console.error("Firestore syncWatchlist error:", e)
  }
}

// ── Sync watch history ─────────────────────────────────────────
export async function syncHistory(uid: string, history: HistoryItem[]) {
  try {
    const ref = doc(firestore, "users", uid)
    await updateDoc(ref, { history, updatedAt: serverTimestamp() })
  } catch (e) {
    console.error("Firestore syncHistory error:", e)
  }
}
