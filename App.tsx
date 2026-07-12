import { StyleSheet, View, LogBox } from 'react-native'
LogBox.ignoreLogs(['Open debugger to view warning']);
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Router } from './src/navigation/Router'

import { ThemeProvider } from './src/theme/ThemeContext'
import { FavoritesProvider } from './src/store/FavoritesContext'
import { SettingsProvider } from './src/store/SettingsContext'
import { WatchlistProvider } from './src/store/WatchlistContext'
import { HistoryProvider } from './src/store/HistoryContext'
import { SearchHistoryProvider } from './src/store/SearchHistoryContext'
import { AuthProvider } from './src/store/AuthContext'
import { CollectionsProvider } from './src/store/CollectionsContext'
import { DownloadsProvider } from './src/store/DownloadsContext'

function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.background} />
      <AuthProvider>
        <SettingsProvider>
          <HistoryProvider>
            <WatchlistProvider>
              <SearchHistoryProvider>
                <FavoritesProvider>
                  <ThemeProvider>
                    <CollectionsProvider>
                      <DownloadsProvider>
                        <Router />
                      </DownloadsProvider>
                    </CollectionsProvider>
                  </ThemeProvider>
                </FavoritesProvider>
              </SearchHistoryProvider>
            </WatchlistProvider>
          </HistoryProvider>
        </SettingsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  background: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: '#0a0a0a',
  },
})

export default App
