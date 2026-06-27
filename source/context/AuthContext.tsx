import React, { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

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
  loginWithGoogle: (userInfo: GoogleUser) => Promise<void>
  loginAsGuest: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const AUTH_STORAGE_KEY = "@fabprime_auth_session"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load any saved user session when the app starts up
    async function loadSavedSession() {
      try {
        const savedData = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
        if (savedData) {
          setUser(JSON.parse(savedData))
        }
      } catch (error) {
        console.error("Failed to load auth session", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSavedSession()
  }, [])

  const loginWithGoogle = async (userInfo: GoogleUser) => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userInfo))
      setUser(userInfo)
    } catch (error) {
      console.error("Failed to save Google auth session", error)
      throw error;
    }
  }

  const loginAsGuest = async () => {
    const guestUser: GoogleUser = {
      id: "guest_" + Math.random().toString(36).substr(2, 9),
      name: "Guest Fan",
      email: "guest@fabprime.com",
      photo: null,
      idToken: null,
      isGuest: true
    }
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(guestUser))
      setUser(guestUser)
    } catch (error) {
      console.error("Failed to save Guest session", error)
      throw error;
    }
  }

  const logout = async () => {
    try {
      // Clear the locally saved user info
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY)
      setUser(null)

    } catch (error) {
      console.error("Error signing out user", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginWithGoogle,
        loginAsGuest,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider")
  }
  return context
}
