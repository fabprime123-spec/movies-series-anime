import React, { useMemo, useCallback } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Container } from '../components/ui/Container'
import { Text } from '../components/ui/Text'
import { MediaSlider } from '../components/MediaSlider'
import { TabbedMediaSlider } from '../components/TabbedMediaSlider'
import { HeroBanner } from '../components/HeroBanner'
import { useTheme } from '../theme/ThemeContext'
import {
  // Movies
  getNowPlayingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies,
  // Series
  getAiringTodaySeries, getPopularSeries, getTopRatedSeries, getOnTheAirSeries,
  // Asian Dramas
  getKDrama, getCDrama, getJDrama, getAsianDrama,
  // Genres
  getAnime, getAnimation, getDocumentaries, getMusic, getFantasy, getSciFi
} from '../api/tmdb'
import LinearGradient from 'react-native-linear-gradient'

const SectionHeader = React.memo(({ title }: { title: string }) => {
  const { theme } = useTheme()
  return (
    <View style={[styles.sectionHeaderContainer, { borderBottomColor: theme.border }]}>
      <Text weight="bold" size={28} style={[styles.sectionHeader, { color: theme.foreground }]}>
        {title}
      </Text>
    </View>
  )
})

export function HomeScreen() {
  const { theme } = useTheme()

  const movieTabs = useMemo(() => [
    { label: "Now Playing", fetchFn: getNowPlayingMovies },
    { label: "Popular", fetchFn: getPopularMovies },
    { label: "Top Rated", fetchFn: getTopRatedMovies },
    { label: "Upcoming", fetchFn: getUpcomingMovies },
  ], [])

  const seriesTabs = useMemo(() => [
    { label: "Airing Today", fetchFn: getAiringTodaySeries },
    { label: "Popular", fetchFn: getPopularSeries },
    { label: "Top Rated", fetchFn: getTopRatedSeries },
    { label: "On The Air", fetchFn: getOnTheAirSeries },
  ], [])

  const sections = useMemo(() => [
    { type: 'hero', key: 'hero' },
    { type: 'header', title: 'Movies', key: 'header-movies' },
    { type: 'tabs', tabs: movieTabs, key: 'tabs-movies' },
    { type: 'header', title: 'Series', key: 'header-series' },
    { type: 'tabs', tabs: seriesTabs, key: 'tabs-series' },
    { type: 'header', title: 'Asian Dramas', key: 'header-asian' },
    { type: 'slider', title: 'K-Dramas', fetchFn: getKDrama, key: 'slider-kdrama' },
    { type: 'slider', title: 'C-Dramas', fetchFn: getCDrama, key: 'slider-cdrama' },
    { type: 'slider', title: 'J-Dramas', fetchFn: getJDrama, key: 'slider-jdrama' },
    { type: 'slider', title: 'All Asian Dramas', fetchFn: getAsianDrama, key: 'slider-all-asian' },
    { type: 'header', title: 'Genres & More', key: 'header-genres' },
    { type: 'slider', title: 'Anime', fetchFn: getAnime, key: 'slider-anime' },
    { type: 'slider', title: 'Animation', fetchFn: getAnimation, key: 'slider-animation' },
    { type: 'slider', title: 'Sci-Fi', fetchFn: getSciFi, key: 'slider-scifi' },
    { type: 'slider', title: 'Fantasy', fetchFn: getFantasy, key: 'slider-fantasy' },
    { type: 'slider', title: 'Documentaries', fetchFn: getDocumentaries, key: 'slider-docs' },
    { type: 'slider', title: 'Music', fetchFn: getMusic, key: 'slider-music' },
  ], [movieTabs, seriesTabs])

  const renderItem = useCallback(({ item }: { item: any }) => {
    switch (item.type) {
      case 'hero':
        return <HeroBanner />;
      case 'header':
        return <SectionHeader title={item.title} />;
      case 'tabs':
        return <TabbedMediaSlider tabs={item.tabs} />;
      case 'slider':
        return <MediaSlider title={item.title} fetchFn={item.fetchFn} />;
      default:
        return null;
    }
  }, []);

  const keyExtractor = useCallback((item: any) => item.key, []);

  return (
    <Container useSafeArea={true}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
      />
      <LinearGradient colors={[theme.background, "transparent"]} style={styles.gradient} pointerEvents="none" />
    </Container>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 80, // Space for the TabBar
  },
  sectionHeaderContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 16,
    marginTop: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionHeader: {
    // Styling applied dynamically
  },
  gradient: {
    position: "absolute",
    top: -1,
    left: 0,
    right: 0,
    height: 40,
  }
})
