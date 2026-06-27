import { createContext, useContext, useState } from "react"
import { colors } from "../constants/colors"
import { accents } from "../constants/accents"

type Mode = "dark" | "light"
interface ThemeContextType {
  theme: typeof colors.dark
  mode: Mode
  accentColor: string
  changeMode: () => void
  changeAccent: (color: string) => void
  blurTarget: any
  setBlurTarget: (ref: any) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark")
  const [accentColor, setAccentColor] = useState(accents.violet)
  const [blurTarget, setBlurTarget] = useState<any>(null)
  const theme = mode === "dark" ? colors.dark : colors.light

  const changeMode = () => setMode((p) => p === "dark" ? "light" : "dark")
  const changeAccent = (color: string) => setAccentColor(color)

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        accentColor,
        changeMode,
        changeAccent,
        blurTarget,
        setBlurTarget
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be inside ThemeProvider")

  return context
}