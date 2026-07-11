import { createContext, useContext, useState } from "react"
import { colors } from "./colors"
import { accents } from "../constants/accents"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Dimensions } from "react-native"

type Mode = "dark" | "light"
interface SafeAreaInsetsType {
  top: number
  bottom: number
  left: number
  right: number
}
interface DimensionsType {
  height: number
  width: number
  scale: number
}
interface ThemeContextType {
  theme: typeof colors.dark
  mode: Mode
  accentColor: string
  changeMode: () => void
  changeAccent: (color: string) => void
  safeAreaInsets: SafeAreaInsetsType
  dimensions: DimensionsType
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark")
  const [accentColor, setAccentColor] = useState(accents.blue)
  const safeAreaInsets = useSafeAreaInsets()
  const { width, height, scale } = Dimensions.get("window")
  const dimensions: DimensionsType = { height, width, scale }


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
        safeAreaInsets,
        dimensions
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