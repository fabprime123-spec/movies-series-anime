import React, { useMemo, useCallback } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Container } from '../components/ui/Container'
import { Text } from '../components/ui/Text'
import { MediaSlider } from '../components/sliders/MediaSlider'
import { TabbedMediaSlider } from '../components/sliders/TabbedMediaSlider'
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
import { NativeGradient } from '../components/native/NativeGradient'
import { Trophy, Play, TrendingUp, Star, Calendar, Flame, CirclePlay } from 'lucide-react-native'

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
  const { theme, mode } = useTheme()

  const movieTabs = useMemo(() => [
    { label: "Now Playing", fetchFn: getNowPlayingMovies, Icon: <CirclePlay size={18} color={theme.foreground} /> },
    { label: "Popular", fetchFn: getPopularMovies, Icon: <Flame size={16} color={theme.foreground} /> },
    { label: "Top Rated", fetchFn: getTopRatedMovies, Icon: <Trophy size={16} color={theme.foreground} /> },
    { label: "Upcoming", fetchFn: getUpcomingMovies, Icon: <Calendar size={16} color={theme.foreground} /> },
  ], [mode, theme.foreground])

  const seriesTabs = useMemo(() => [
    { label: "Airing Today", fetchFn: getAiringTodaySeries, Icon: <CirclePlay size={18} color={theme.foreground} /> },
    { label: "Popular", fetchFn: getPopularSeries, Icon: <Flame size={16} color={theme.foreground} /> },
    { label: "Top Rated", fetchFn: getTopRatedSeries, Icon: <Trophy size={16} color={theme.foreground} /> },
    { label: "On The Air", fetchFn: getOnTheAirSeries, Icon: <Calendar size={16} color={theme.foreground} /> },
  ], [mode, theme.foreground])

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
    <Container>
      <FlatList
        data={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
      <NativeGradient
        colors={[theme.background, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
        pointerEvents="none"
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 110, // Space for the TabBar
    gap: 24
  },
  sectionHeaderContainer: {
    paddingHorizontal: 10,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionHeader: {
    // Styling applied dynamically
    paddingHorizontal: 8
  },
  gradient: {
    position: "absolute",
    top: -1,
    left: 0,
    right: 0,
    height: 40,
  }
})
