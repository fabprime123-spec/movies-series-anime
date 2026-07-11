import React, { useState, useCallback } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Container } from '../components/ui/Container'
import { Text } from '../components/ui/Text'
import { useFavorites } from '../store/FavoritesContext'
import { useWatchlist } from '../store/WatchlistContext'
import { useHistory } from '../store/HistoryContext'
import { NativeMediaList } from '../components/native/NativeMediaList'
import { MediaCard } from '../components/cards/MediaCard'
import { useTheme } from '../theme/ThemeContext'
import { Wave, Dots, Pulse, Spin, Audio, Breathe, Typing, Squish, PingPong, Morph, Lines, Radar } from "../animations/animation"
import { NativeGradient } from '../components/native/NativeGradient'
import { SearchCard } from '../components/cards/SearchCard'
import { Bookmark, Download, Heart, Shapes, Timer } from 'lucide-react-native'
import LinearGradient from 'react-native-linear-gradient'

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

  // const TABS: Tab[] = ['Favorites', 'Watchlist', 'History', 'Downloads', 'Collections']
  const TABS = [
    { Icon: <Heart color={theme.foreground} size={17} />, name: 'Favorites' },
    { Icon: <Bookmark color={theme.foreground} size={17} />, name: 'Watchlist' },
    { Icon: <Timer color={theme.foreground} size={17} />, name: 'History' },
    { Icon: <Download color={theme.foreground} size={17} />, name: 'Downloads' },
    { Icon: <Shapes color={theme.foreground} size={17} />, name: 'Collections' }
  ]

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
      <View style={[styles.tabScrollWrapper, { backgroundColor: theme.background, zIndex: 40 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity key={tab.name} style={[styles.tab, {
              boxShadow: `0px 0px 8px ${theme.foreground}, inset 0px 0px 10px ${theme.foreground}`,
              backgroundColor: activeTab === tab.name ? accentColor : theme.background + "00",
            }]}
              onPress={() => setActiveTab(tab.name as Tab)}
            >
              {React.cloneElement(tab.Icon as React.ReactElement<any>, { color: activeTab === tab.name ? theme.background : theme.foreground })}
              <Text weight="bold" color={activeTab === tab.name ? theme.background : theme.foreground}>{tab.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <NativeGradient
          colors={[theme.background, "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <LinearGradient
          colors={[theme.background, "transparent",]}
          style={[{
            position: "absolute",
            bottom: -10,
            height: 10,
            width: '100%',
          }]}
          pointerEvents='none'
        />
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1, marginTop: -10 }}>
        {data.length > 0 ? (
          <NativeMediaList
            key={activeTab}
            data={data}
            isGrid={true}
            isHorizontalCard={false}
            onItemPress={(e) => {
              const media = data.find((m: any) => m.id === e.nativeEvent.id);
              navigation.navigate('Details', { id: e.nativeEvent.id, type: media?.media_type || e.nativeEvent.mediaType || (media?.title ? 'movie' : 'tv') })
            }}
            style={{ flex: 1, width: '100%' }}
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
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  headerTitle: {
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  tabScrollWrapper: {
    marginBottom: 0,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 16,
    overflow: "visible",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  grid: {
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