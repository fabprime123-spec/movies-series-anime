import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export interface User {
  name: string;
  email: string;
  photo: string | null;
  isGuest: boolean;
}

export interface AuthData {
  user: User | null;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthData | undefined>(undefined);

// Configure Google Sign-In outside the component so it runs immediately
GoogleSignin.configure({
  webClientId: '106849519216-kab32t774ef0s8a06b6kbqfuklldqa8c.apps.googleusercontent.com',
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    // Listen to Firebase Auth state changes
    const subscriber = auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          photo: firebaseUser.photoURL,
          isGuest: false,
        });
      } else if (!user?.isGuest) {
        setUser(null);
      }
      setIsLoading(false);
    });

    return subscriber; // unsubscribe on unmount
  }, []);

  const loginWithGoogle = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const { data } = await GoogleSignin.signIn();
      
      if (!data?.idToken) {
        throw new Error('No ID token found');
      }

      // Get the access token
      const tokens = await GoogleSignin.getTokens();

      // Create a Google credential with both tokens
      const googleCredential = auth.GoogleAuthProvider.credential(data.idToken, tokens.accessToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error("Google Sign-In Error", error);
      throw error;
    }
  };

  const loginAsGuest = () => {
    setUser({
      name: "Guest",
      email: "",
      photo: null,
      isGuest: true,
    });
  };

  const logout = async () => {
    try {
      if (!user?.isGuest) {
        await auth().signOut();
        try {
          await GoogleSignin.signOut();
        } catch (e) {
          // Ignore if not signed in with google
        }
      }
      setUser(null);
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, loginWithGoogle, loginAsGuest, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
