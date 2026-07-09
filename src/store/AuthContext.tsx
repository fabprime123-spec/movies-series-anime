import React, { createContext, useContext, useState } from 'react';

export interface User {
  name: string;
  email: string;
  photo: string | null;
  isGuest: boolean;
}

export interface AuthData {
  user: User | null;
  logout: () => void;
  login: (user: User) => void;
}

const AuthContext = createContext<AuthData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    name: "Alex Developer",
    email: "alex@fabprime.com",
    photo: null,
    isGuest: false,
  });

  const logout = () => setUser(null);
  const login = (newUser: User) => setUser(newUser);

  return (
    <AuthContext.Provider value={{ user, logout, login }}>
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
