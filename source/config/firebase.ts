// ─────────────────────────────────────────────────────────────
//  FIREBASE CONFIG
//  You will fill in YOUR values here from the Firebase Console.
//  See the setup guide in the chat for step-by-step instructions.
// ─────────────────────────────────────────────────────────────
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { initializeAuth, inMemoryPersistence } from "firebase/auth"

// PASTE YOUR FIREBASE CONFIG HERE (Step 5 of the setup guide)
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
}

// Prevent re-initializing Firebase on hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Auth — session persistence is handled by our AuthContext via AsyncStorage
export const firebaseAuth = initializeAuth(app, {
  persistence: inMemoryPersistence,
})

// Firestore database instance
export const firestore = getFirestore(app)
