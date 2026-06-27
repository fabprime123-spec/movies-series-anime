import { useState, useRef, useEffect } from "react"
import { Animated, StyleSheet, View, TouchableOpacity } from "react-native"
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

export function SearchScreen() {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "movie" | "series">("all")
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const { data = [], isLoading } = useSearch(query)
  const { data: trendingData = [], isLoading: isLoadingTrending } = useTrending()
  const { theme, accentColor } = useTheme()
  const scrollY = useRef(new Animated.Value(0)).current

  // Load search history on mount
  useEffect(() => {
    loadRecentSearches()
  }, [])

  // Reset scroll and filters when search query changes
  useEffect(() => {
    scrollY.setValue(0)
    setActiveFilter("all")
  }, [query])

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem("recent_searches")
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } catch (e) {
      console.error("Error loading recent searches:", e)
    }
  }

  const saveSearchQuery = async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed || trimmed.length < 2) return
    try {
      const filtered = recentSearches.filter(
        item => item.toLowerCase() !== trimmed.toLowerCase()
      )
      const updated = [trimmed, ...filtered].slice(0, 8)
      setRecentSearches(updated)
      await AsyncStorage.setItem("recent_searches", JSON.stringify(updated))
    } catch (e) {
      console.error("Error saving search query:", e)
    }
  }

  const removeRecentSearch = async (q: string) => {
    try {
      const updated = recentSearches.filter(item => item !== q)
      setRecentSearches(updated)
      await AsyncStorage.setItem("recent_searches", JSON.stringify(updated))
    } catch (e) {
      console.error("Error removing search query:", e)
    }
  }

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([])
      await AsyncStorage.removeItem("recent_searches")
    } catch (e) {
      console.error("Error clearing search history:", e)
    }
  }

  // Pure scroll listener driven by native thread
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  )

  const opacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [0, 1],
    extrapolate: "clamp"
  })

  // Filter raw API results on client side
  const filteredData = data.filter((item: any) => {
    if (activeFilter === "all") return true
    if (activeFilter === "movie") {
      return item.media_type === "movie" || !!item.title
    }
    if (activeFilter === "series") {
      return item.media_type === "tv" || !!item.name
    }
    return true
  })

  const filters = [
    { id: "all", label: "All" },
    { id: "movie", label: "Movies" },
    { id: "series", label: "Series" }
  ] as const

  return (
    <Container style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => saveSearchQuery(query)}
      />

      {query.trim().length > 0 && (
        <View style={styles.filterRow}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id
            return (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: isActive ? accentColor : theme.card,
                    borderColor: isActive ? accentColor : theme.border,
                  }
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    {
                      color: isActive ? "#FFFFFF" : theme.foreground,
                      fontFamily: isActive ? "GeneralSans-Semibold" : "GeneralSans-Medium",
                    }
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}

      {/* Relative container wrapping the scrollable area */}
      <View style={styles.contentWrapper}>
        {query.trim().length === 0 ? (
          <SearchEmpty
            recentSearches={recentSearches}
            onSelectRecent={(q) => {
              setQuery(q)
              saveSearchQuery(q)
            }}
            onRemoveRecent={removeRecentSearch}
            onClearRecent={clearRecentSearches}
            trending={trendingData.map(normalizeTrending)}
            isLoadingTrending={isLoadingTrending}
          />
        ) : (
          <SearchResults
            data={filteredData}
            isLoading={isLoading}
            onScroll={handleScroll}
          />
        )}

        {/* Top Fade Gradient - positioned at top: 0 relative to contentWrapper */}
        <Animated.View style={[styles.topGradient, { opacity }]} pointerEvents="none">
          <LinearGradient
            colors={[theme.background, "transparent"]}
            style={{ flex: 1 }}
          />
        </Animated.View>

        {/* Bottom Fade Gradient - positioned at bottom: 0 relative to contentWrapper */}
        <Animated.View style={[styles.bottomGradient, { opacity }]} pointerEvents="none">
          <LinearGradient
            colors={["transparent", theme.background]}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10
  },
  filterRow: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 4,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterTabText: {
    fontSize: 14,
  },
  contentWrapper: {
    flex: 1,
    position: "relative",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 35,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
  }
})