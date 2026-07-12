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
import { CustomAlert } from '../components/ui/CustomAlert'
import { NativeGridMediaList } from '../components/native/NativeGridMediaList'

const { width } = Dimensions.get("window")
export function SearchScreen() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [clearSearchVisible, setClearSearchVisible] = useState(false)
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const { recentSearches, addSearch, removeSearch, clearSearches } = useSearchHistory()

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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
          paddingTop: 30,
          height: "auto",
          gap: 20,
        }}>
          {recentSearches.length > 0 && (
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <Text weight="bold" size={16}>Recent Searches</Text>
                <TouchableOpacity onPress={() => setClearSearchVisible(true)}>
                  <Text color={theme.muted} size={12}>Clear</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recentPills}>
                {recentSearches.map((keyword, index) => (
                  <View key={index} style={[styles.pillContainer, { borderColor: theme.border, backgroundColor: theme.card }]}>
                    <TouchableOpacity
                      style={styles.pillTextContainer}
                      onPress={() => handleRecentSearchTap(keyword)}
                    >
                      <Clock color={theme.muted} size={14} />
                      <Text size={12}>{keyword}</Text>
                    </TouchableOpacity>
                    <View style={[styles.pillDivider, { backgroundColor: theme.border }]} />
                    <TouchableOpacity
                      style={styles.pillRemoveBtn}
                      onPress={() => removeSearch(keyword)}
                    >
                      <X color={theme.muted} size={14} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
          {trending.length > 0 && (
            <Top10Slider data={trending} title="Top Searches Today" />
          )}
        </ScrollView>
      ) : (
        <NativeGridMediaList
          key={query}
          data={results}
          style={{ flex: 1, width: '100%', paddingTop: 24 }}
        />
      )}

      <CustomAlert
        visible={clearSearchVisible}
        onClose={() => setClearSearchVisible(false)}
        title="Clear Searches"
        message="Are you sure you want to clear your search history?"
        buttons={[
          { text: "Cancel", style: "cancel" },
          { text: "Clear", style: "destructive", onPress: () => clearSearches() }
        ]}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    justifyContent: "flex-start"
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
    gap: 8,
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pillTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 8,
  },
  pillDivider: {
    width: 1,
    height: '60%',
  },
  pillRemoveBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
