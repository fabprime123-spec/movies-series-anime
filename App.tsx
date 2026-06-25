import { ThemeProvider } from './source/context/ThemeContext'
import { Router } from './source/navigation/Router'

export default function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  )
}