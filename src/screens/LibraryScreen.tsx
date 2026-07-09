import React, { useState, useCallback } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Container } from '../components/ui/Container'
import { Text } from '../components/ui/Text'
import { useFavorites } from '../store/FavoritesContext'
import { useWatchlist } from '../store/WatchlistContext'
import { useHistory } from '../store/HistoryContext'
import { MediaCard } from '../components/cards/MediaCard'
import { useTheme } from '../theme/ThemeContext'
import { Wave, Dots, Pulse, Spin, Audio, Breathe, Typing, Squish, PingPong, Morph, Lines, Radar } from "../animations/animation"
import LinearGradient from 'react-native-linear-gradient'
import { SearchCard } from '../components/cards/SearchCard'

type Tab = 'Favorites' | 'Watchlist' | 'History' | 'Downloads' | 'Collections'
const animations = [
  "Wave",
  "Audio",
  "Breathe",
  "Dots",
  "Lines",
  "Morph",
  "PingPong",
  "Pulse",
  "Radar",
  "Spin",
  "Squish",
  "Typing",
]

export function LibraryScreen() {
  const { theme, accentColor } = useTheme()
  const navigation = useNavigation<any>()
  const [activeTab, setActiveTab] = useState<Tab>('Favorites')
  const x = <View style={{ height: 40, width: 40 }} />

  const { favorites } = useFavorites()
  const { watchlist } = useWatchlist()
  const { history } = useHistory()

  const getTabData = () => {
    switch (activeTab) {
      case 'Favorites': return favorites
      case 'Watchlist': return watchlist
      case 'History': return history
      default: return []
    }
  }

  const data = getTabData()

  const TABS: Tab[] = ['Favorites', 'Watchlist', 'History', 'Downloads', 'Collections']

  const keyExtractor = useCallback((item: any) => `${item.id}-${activeTab}`, [activeTab])
  const renderItem = useCallback(({ item }: any) => (
    <SearchCard
      media={item}
      onPress={() => navigation.navigate('Details', { id: item.id, type: item.title ? 'movie' : 'tv' })}
    />
  ), [navigation])

  return (
    <Container useSafeArea contentContainerStyle={styles.container}>
      <Text weight="bold" size={32} style={styles.headerTitle}>Library</Text>

      {/* TABS */}
      <View style={[styles.tabScrollWrapper]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity key={tab} style={[styles.tab, {
              boxShadow: `0px 0px 8px ${theme.foreground}, inset 0px 0px 10px ${theme.foreground}`,
              backgroundColor: activeTab === tab ? accentColor : theme.background + "00",
            }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text weight="bold" color={activeTab === tab ? theme.background : theme.foreground}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <LinearGradient
          colors={[theme.background, "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          pointerEvents='none'
        />
      </View>

      {/* CONTENT */}
      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          initialNumToRender={9}
          maxToRenderPerBatch={6}
          windowSize={5}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text color={theme.muted} style={{ textAlign: 'center' }}>
            {activeTab === 'Downloads' ? 'No downloaded content yet.' :
              activeTab === 'Collections' ? 'Create collections to organize your media.' :
                `Your ${activeTab.toLowerCase()} is empty.`}
          </Text>
        </View>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  headerTitle: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  tabScrollWrapper: {
    marginBottom: 8,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 16,
    overflow: "visible",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  grid: {
    paddingTop: 0,
    paddingHorizontal: 10,
    paddingBottom: 90,
  },
  row: {
    justifyContent: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  }
})