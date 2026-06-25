import { TMDB_KEY } from './source/constants/config'
import { ThemeProvider } from './source/context/ThemeContext'
import { useFonts } from './source/hooks/useFonts'
import { Router } from './source/navigation/Router'
import { AppProvider } from './source/providers/AppProvider'


export default function App() {
  const [loaded] = useFonts()
  if (!loaded) return null

  return (
    <ThemeProvider>
      <AppProvider>
        <Router />
      </AppProvider>
    </ThemeProvider>
  )
}