import React, { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth"
import { firebaseAuth } from "../config/firebase"
import { useMediaStore } from "../store/media.store"

// ─── Types ────────────────────────────────────────────────────
export interface GoogleUser {
  id: string
  name: string | null
  email: string
  photo: string | null
  idToken: string | null
  isGuest?: boolean
}

interface AuthContextType {
  user: GoogleUser | null
  isLoading: boolean
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  loginAsGuest: () => Promise<void>
  logout: () => Promise<void>
  /** @deprecated Use signInWithGoogle instead */
  loginWithGoogle: (userInfo: GoogleUser) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)
const GUEST_STORAGE_KEY = "@fabprime_guest_session"

// ─── Configure Google Sign-In ─────────────────────────────────
// IMPORTANT: Replace this with your actual Web Client ID from Firebase Console
// (Settings → General → Your apps → Web app → Client ID)
GoogleSignin.configure({
  webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
})

// ─── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const googleUser: GoogleUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email ?? "",
          photo: firebaseUser.photoURL,
          idToken: null,
          isGuest: false,
        }
        setUser(googleUser)
        // Load this user's cloud data into the store
        useMediaStore.getState().loadFromCloud(firebaseUser.uid)
      } else {
        try {
          const saved = await AsyncStorage.getItem(GUEST_STORAGE_KEY)
          if (saved) {
            setUser(JSON.parse(saved))
          } else {
            setUser(null)
          }
        } catch {
          setUser(null)
        }
      }
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  // ── Real Google Sign-In ──────────────────────────────────────
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const { data } = await GoogleSignin.signIn()
      const idToken = data?.idToken
      if (!idToken) throw new Error("No ID token returned from Google")

      // Exchange the Google token for a Firebase credential
      const credential = GoogleAuthProvider.credential(idToken)
      await signInWithCredential(firebaseAuth, credential)
      // onAuthStateChanged above will update the user state automatically
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled Google sign-in")
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign-in already in progress")
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available")
      } else {
        console.error("Google sign-in error:", error)
        throw error
      }
    }
  }

  // ── Guest Sign-In (local only, no cloud sync) ─────────────────
  const loginAsGuest = async () => {
    const guestUser: GoogleUser = {
      id: "guest_" + Math.random().toString(36).substr(2, 9),
      name: "Guest Fan",
      email: "guest@fabprime.com",
      photo: null,
      idToken: null,
      isGuest: true,
    }
    await AsyncStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser))
    setUser(guestUser)
  }

  // ── Legacy shim (kept for backward compat) ────────────────────
  const loginWithGoogle = async (userInfo: GoogleUser) => {
    setUser(userInfo)
  }

  // ── Logout ────────────────────────────────────────────────────
  const logout = async () => {
    try {
      if (firebaseAuth.currentUser) {
        await firebaseSignOut(firebaseAuth)
        try { await GoogleSignin.signOut() } catch {}
      }
      await AsyncStorage.removeItem(GUEST_STORAGE_KEY)
      // Clear the local store so the next user starts fresh
      useMediaStore.getState().clearUserData()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signInWithGoogle,
        loginAsGuest,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside an AuthProvider")
  return context
}
