import { ThemeProvider } from './source/context/ThemeContext'
import { useFonts } from './source/hooks/useFonts'
import { Router } from './source/navigation/Router'

export default function App() {
  const [loaded] = useFonts()
  if (!loaded) return null

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  )
}