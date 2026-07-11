import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Keyboard, Dimensions, ScrollView } from 'react-native'
import { Search as SearchIcon, X, Clock } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { Container } from '../components/ui/Container'
import { Text } from '../components/ui/Text'
import { MediaCard } from '../components/cards/MediaCard'
import { searchMedia, getTrending } from '../api/tmdb'
import { useTheme } from '../theme/ThemeContext'
import { useSearchHistory } from '../store/SearchHistoryContext'
import { SearchCard } from '../components/cards/SearchCard'
import { NativeGradient } from '../components/native/NativeGradient'
import { Top10Slider } from '../components/sliders/Top10Slider'

const { width } = Dimensions.get("window")
export function SearchScreen() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const { recentSearches, addSearch, clearSearches } = useSearchHistory()

  useEffect(() => {
    getTrending().then(res => setTrending(res.results)).catch(console.error)
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 2) {
        performSearch(query)
      } else {
        setResults([])
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true)
    try {
      const data = await searchMedia(searchQuery)
      setResults(data.results || [])
    } catch (e) {
      console.error(e)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchSubmit = () => {
    Keyboard.dismiss()
    if (query.trim()) {
      addSearch(query)
    }
  }

  const handleRecentSearchTap = (keyword: string) => {
    setQuery(keyword)
    performSearch(keyword)
    Keyboard.dismiss()
  }

  const keyExtractor = useCallback((item: any) => item.id.toString(), [])

  const renderItem = useCallback(({ item }: any) => (
    <SearchCard
      media={item}
      onPress={() => {
        if (query.trim()) addSearch(query)
        navigation.navigate('Details', { id: item.id, type: item.media_type || 'movie' })
      }}
    />
  ), [query, addSearch, navigation])

  return (
    <Container useSafeArea contentContainerStyle={styles.container}>
      <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
        <SearchIcon color={theme.muted} size={20} />
        <TextInput
          style={[styles.input, { color: theme.foreground }]}
          placeholder="Search movies, tv shows, people..."
          placeholderTextColor={theme.muted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <X color={theme.muted} size={20} />
          </TouchableOpacity>
        )}
        <NativeGradient
          colors={[theme.background, theme.background, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
          pointerEvents="none"
        />
      </View>

      {!query.trim() ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingTop: 30 }}>
          {recentSearches.length > 0 && (
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <Text weight="bold" size={16}>Recent Searches</Text>
                <TouchableOpacity onPress={clearSearches}>
                  <Text color={theme.muted} size={12}>Clear</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recentPills}>
                {recentSearches.map((keyword, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.pill, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={() => handleRecentSearchTap(keyword)}
                  >
                    <Clock color={theme.muted} size={14} />
                    <Text size={12}>{keyword}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {trending.length > 0 && (
            <Top10Slider data={trending} title="Top Searches Today" />
          )}
        </ScrollView>
      ) : (
        <FlatList
          data={results}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 15,
    justifyContent: "center"
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'GeneralSans-Regular',
    fontSize: 16,
  },
  gradient: {
    position: "absolute",
    height: 30, width: width,
    bottom: -30,
    zIndex: 50
  },
  grid: {
    paddingTop: 24,
    paddingHorizontal: 10,
    paddingBottom: 105,
  },
  row: {
    justifyContent: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  recentSection: {
    paddingHorizontal: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  }
})
