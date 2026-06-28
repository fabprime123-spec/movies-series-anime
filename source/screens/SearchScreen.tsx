import { useState, useRef, useEffect } from "react"
import { Animated, StyleSheet, View, TouchableOpacity, ScrollView } from "react-native"
import { Container } from "../components/ui/Container"
import { SearchBar } from "../components/search/SearchBar"
import { SearchResults } from "../components/search/SearchResults"
import { SearchEmpty } from "../components/search/SearchEmpty"
import { useSearch } from "../hooks/useSearch"
import { useTrending } from "../hooks/useTrending"
import { normalizeTrending } from "../utils/normalize"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "../context/ThemeContext"
import { Text } from "../components/ui/Text"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useSettingsStore } from "../store/settings.store"
import { useNavigation } from "@react-navigation/native"

export function SearchScreen() {
  const navigation = useNavigation<any>()
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "movie" | "series">("all")
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const { data = [], isLoading } = useSearch(query)
  const { data: trendingData = [], isLoading: isLoadingTrending } = useTrending()
  const { theme, accentColor } = useTheme()
  const { excludedCountries, filterLanguage, selectedPlatforms, filterYear } = useSettingsStore()

  const applyGlobalFilters = (list: any[]) => {
    return list.filter(item => {
      if (item.countries && item.countries.some((code: string) => excludedCountries.includes(code))) return false
      if (filterLanguage !== "All" && item.original_language !== filterLanguage) return false
      if (item.platform && !selectedPlatforms.includes(item.platform)) return false
      if (filterYear !== "All") {
        if (filterYear === "2020+") {
          const y = parseInt(item.release_year)
          if (isNaN(y) || y < 2020) return false
        } else if (filterYear === "2010+") {
          const y = parseInt(item.release_year)
          if (isNaN(y) || y < 2010) return false
        } else {
          if (item.release_year !== filterYear) return false
        }
      }
      return true
    })
  }

  const scrollY = useRef(new Animated.Value(0)).current

  useEffect(() => { loadRecentSearches() }, [])

  useEffect(() => {
    scrollY.setValue(0)
    setActiveFilter("all")
  }, [query])

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem("recent_searches")
      if (saved) setRecentSearches(JSON.parse(saved))
    } catch (e) { }
  }

  const saveSearchQuery = async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed || trimmed.length < 2) return
    try {
      const filtered = recentSearches.filter(item => item.toLowerCase() !== trimmed.toLowerCase())
      const updated = [trimmed, ...filtered].slice(0, 8)
      setRecentSearches(updated)
      await AsyncStorage.setItem("recent_searches", JSON.stringify(updated))
    } catch (e) { }
  }

  const removeRecentSearch = async (q: string) => {
    try {
      const updated = recentSearches.filter(item => item !== q)
      setRecentSearches(updated)
      await AsyncStorage.setItem("recent_searches", JSON.stringify(updated))
    } catch (e) { }
  }

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([])
      await AsyncStorage.removeItem("recent_searches")
    } catch (e) { }
  }

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  )

  const handleSurpriseMe = (id: number, type: "movie" | "series") => {
    navigation.navigate("Details" as any, { id, type })
  }

  const filteredData = data.filter((item: any) => {
    if (activeFilter === "all") return true
    if (activeFilter === "movie") return item.media_type === "movie" || !!item.title
    if (activeFilter === "series") return item.media_type === "tv" || !!item.name
    return true
  })

  const filters = [
    { id: "all", label: "All" },
    { id: "movie", label: "Movies" },
    { id: "series", label: "Series" }
  ] as const

  const hasQuery = query.trim().length > 0

  return (
    <Container style={styles.container}>
      {/* ── Sticky header ── */}
      <View style={styles.headerContainer}>
        {/* Gradient fade from solid background to transparent */}
        <LinearGradient
          colors={[theme.background, theme.background, `${theme.background}00`]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Search bar */}
        <View style={styles.searchRow}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => saveSearchQuery(query)}
          />
        </View>

        {/* Filter pills – only visible when actively searching */}
        {hasQuery && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsContent}
            style={styles.filterPillsScroll}
          >
            {filters.map(filter => {
              const isActive = activeFilter === filter.id
              return (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => setActiveFilter(filter.id)}
                  style={[
                    styles.filterPill,
                    {
                      backgroundColor: isActive ? accentColor : theme.card,
                      borderColor: isActive ? accentColor : theme.border,
                    }
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterPillText, { color: isActive ? "#FFFFFF" : theme.foreground, fontFamily: isActive ? "GeneralSans-Bold" : "GeneralSans-Medium" }]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        )}
      </View>

      {/* ── Scrollable content (fills screen; uses paddingTop to clear floating header) ── */}
      <View style={styles.contentWrapper}>
        {!hasQuery ? (
          <SearchEmpty
            recentSearches={recentSearches}
            onSelectRecent={q => { setQuery(q); saveSearchQuery(q) }}
            onRemoveRecent={removeRecentSearch}
            onClearRecent={clearRecentSearches}
            trending={applyGlobalFilters(trendingData.map(normalizeTrending))}
            isLoadingTrending={isLoadingTrending}
            contentContainerStyle={{ paddingTop: 80 }}
            onSurpriseMe={handleSurpriseMe}
          />
        ) : (
          <SearchResults
            data={filteredData}
            isLoading={isLoading}
            onScroll={handleScroll}
            contentContainerStyle={{ paddingTop: 110 }}
          />
        )}
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  filterPillsScroll: {
    paddingBottom: 10,
  },
  filterPillsContent: {
    paddingHorizontal: 18,
    paddingBottom: 2,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 2,
    borderColor: '#fff'
  },
  filterPillText: {
    fontSize: 13,
  },
  contentWrapper: {
    flex: 1,
  },
})
