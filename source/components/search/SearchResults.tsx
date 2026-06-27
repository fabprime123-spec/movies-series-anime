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

interface Props {
  data: any[]
  isLoading: boolean
  onScroll?: any
}

export function SearchResults({
  data,
  isLoading,
  onScroll
}: Props) {
  const { theme } = useTheme()

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
      contentContainerStyle={styles.list}
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
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    margin: 10,
  }
})