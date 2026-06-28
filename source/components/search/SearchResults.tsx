import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  View
} from "react-native"

import { Text } from "../ui/Text"

import { normalizeMedia } from "../../utils/normalize"
import { SearchCard } from "../cards/SearchCard"
import { Tv } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useSettingsStore } from "../../store/settings.store"

interface Props {
  data: any[]
  isLoading: boolean
  onScroll?: any
  contentContainerStyle?: any
}

export function SearchResults({
  data,
  isLoading,
  onScroll,
  contentContainerStyle
}: Props) {
  const { theme } = useTheme()
  const { excludedCountries, filterLanguage, selectedPlatforms, filterYear } = useSettingsStore()

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const results = data
    .filter(item => item.media_type !== "person")
    .sort((a, b) => b.popularity - a.popularity)
    .map(normalizeMedia)
    .filter((item: any) => {
      // 1. Excluded countries check
      if (item.countries && item.countries.some((code: string) => excludedCountries.includes(code))) {
        return false
      }

      // 2. Original language check
      if (filterLanguage !== "All" && item.original_language !== filterLanguage) {
        return false
      }

      // 3. Platform check
      if (item.platform && !selectedPlatforms.includes(item.platform)) {
        return false
      }

      // 4. Release year check
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

  if (results.length === 0) {
    return (
      <View style={styles.center}>
        <Tv size={50} color={theme.foreground} style={styles.icon} />
        <Text style={{ fontSize: 20 }}>No results found.</Text>
      </View>
    )
  }

  return (
    <Animated.FlatList
      data={results}
      keyExtractor={(item) => `${item.type}-${item.id}`}
      numColumns={3}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.list, contentContainerStyle]}
      renderItem={({ item }) => (
        <SearchCard item={item} />
      )}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 10,
    paddingBottom: 110,
    paddingHorizontal: 8,
    gap: 8
  },
  row: {
    justifyContent: "flex-start",
    gap: 8,
    marginHorizontal: 8
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    margin: 0,
  }
})