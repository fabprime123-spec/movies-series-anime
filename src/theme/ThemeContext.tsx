import { createContext, useContext, useState } from "react"
import { colors } from "./colors"
import { accents } from "./accents"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Mode = "dark" | "light"
interface SafeAreaInsets {
  top: number
  bottom: number
  left: number
  right: number
}
interface ThemeContextType {
  theme: typeof colors.dark
  mode: Mode
  accentColor: string
  changeMode: () => void
  changeAccent: (color: string) => void
  safeAreaInsets: SafeAreaInsets
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark")
  const [accentColor, setAccentColor] = useState(accents.blue)
  const safeAreaInsets = useSafeAreaInsets()

  const theme = colors[mode]
  const changeMode = () => setMode((prevMode) => prevMode === "dark" ? "light" : "dark")
  const changeAccent = (color: string) => setAccentColor(color)

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        accentColor,
        changeMode,
        changeAccent,
        safeAreaInsets
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be inside ThemeProvider")
  return context
}