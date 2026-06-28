import { View, Image, TouchableOpacity, StyleSheet, FlatList, Platform, ScrollView, Pressable } from "react-native"
import { Container } from "../components/ui/Container"
import { MediaSlider } from "../components/sliders/MediaSlider"
import { SectionHeader } from "../components/headers/SectionHeader"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation, StackActions } from "@react-navigation/native"
import { Play, Plus, User, Search, Bell, Star, Film } from "lucide-react-native"
import { Text } from "../components/ui/Text"
import { useMemo } from "react"
import { MovieHub } from "../components/Home/MovieHub"
import { SeriesHub } from "../components/Home/SeriesHub"
import { useSettingsStore } from "../store/settings.store"

import {
  useNowPlayingMovies,
  usePopularMovies,
  useTopRatedMovies,
  useUpcomingMovies
} from "../hooks/useMovies"
import {
  useAiringTodaySeries,
  usePopularSeries,
  useTopRatedSeries,
  useOnTheAirSeries
} from "../hooks/useSeries"
import {
  useAnime,
  useDocumentary,
  useKDrama,
  useCDrama,
  useJDrama,
  useAsianDrama
} from "../hooks/useCategories"
import { useGenreMovies } from "../hooks/useGenreMovies"
import { useGenreSeries } from "../hooks/useGenreSeries"
import { useTrending } from "../hooks/useTrending"

import {
  normalizeMovies,
  normalizeSeries,
  normalizeMedia,
  normalizeTrending
} from "../utils/normalize"

export function HomeScreen() {
  const navigation = useNavigation<any>()
  const { theme, mode, accentColor, blurTarget } = useTheme()
  const { user } = useAuth()
  const {
    excludedCountries,
    filterLanguage,
    selectedPlatforms,
    filterYear
  } = useSettingsStore()

  // Apply all content filters (excluding countries, platforms, language, year)
  const applyGlobalFilters = (list: any[]) => {
    return list.filter(item => {
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
  }

  // Movies queries
  const { data: nowPlayingMovies = [] } = useNowPlayingMovies()
  const { data: popularMovies = [] } = usePopularMovies()
  const { data: topRatedMovies = [] } = useTopRatedMovies()
  const { data: upcomingMovies = [] } = useUpcomingMovies()

  // Series queries
  const { data: airingTodaySeries = [] } = useAiringTodaySeries()
  const { data: popularSeries = [] } = usePopularSeries()
  const { data: topRatedSeries = [] } = useTopRatedSeries()
  const { data: onTheAirSeries = [] } = useOnTheAirSeries()

  // Categories queries
  const { data: kdrama = [] } = useKDrama()
  const { data: cdrama = [] } = useCDrama()
  const { data: jdrama = [] } = useJDrama()
  const { data: asianDrama = [] } = useAsianDrama()
  const { data: anime = [] } = useAnime()
  const { data: documentary = [] } = useDocumentary()

  // Genre queries
  const { data: animMovies = [] } = useGenreMovies("animation")
  const { data: animSeries = [] } = useGenreSeries("animation")
  const { data: fanMovies = [] } = useGenreMovies("fantasy")
  const { data: fanSeries = [] } = useGenreSeries("fantasy")
  const { data: musMovies = [] } = useGenreMovies("music")
  const { data: musSeries = [] } = useGenreSeries("music")
  const { data: sciMovies = [] } = useGenreMovies("sci_fi")
  const { data: sciSeries = [] } = useGenreSeries("sci_fi")

  // Hero query
  const { data: trendingData = [] } = useTrending()

  // Deduplication helper
  const deduplicate = (list: any[]) => {
    const seen = new Set()
    return list.filter(item => {
      const key = `${item.type}-${item.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  // Pre-normalized datasets to pass as props to MovieHub and SeriesHub
  const normalizedMoviesData = useMemo(() => {
    return {
      nowPlaying: applyGlobalFilters(nowPlayingMovies.map(normalizeMovies)),
      popular: applyGlobalFilters(popularMovies.map(normalizeMovies)),
      topRated: applyGlobalFilters(topRatedMovies.map(normalizeMovies)),
      upcoming: applyGlobalFilters(upcomingMovies.map(normalizeMovies))
    }
  }, [nowPlayingMovies, popularMovies, topRatedMovies, upcomingMovies, excludedCountries, filterLanguage, selectedPlatforms, filterYear])

  const normalizedSeriesData = useMemo(() => {
    return {
      airingToday: applyGlobalFilters(airingTodaySeries.map(normalizeSeries)),
      popular: applyGlobalFilters(popularSeries.map(normalizeSeries)),
      topRated: applyGlobalFilters(topRatedSeries.map(normalizeSeries)),
      onTheAir: applyGlobalFilters(onTheAirSeries.map(normalizeSeries))
    }
  }, [airingTodaySeries, popularSeries, topRatedSeries, onTheAirSeries, excludedCountries, filterLanguage, selectedPlatforms, filterYear])

  // Use useMemo to cache computed and normalized data
  const computedSections = useMemo(() => {
    const kdramas = applyGlobalFilters(kdrama.map(normalizeSeries))
    const cdramas = applyGlobalFilters(cdrama.map(normalizeSeries))
    const jdramas = applyGlobalFilters(jdrama.map(normalizeSeries))
    const asianDramas = applyGlobalFilters(asianDrama.map(normalizeSeries))
    const animes = applyGlobalFilters(anime.map(normalizeSeries))
    const docs = applyGlobalFilters(documentary.map(normalizeMedia))

    const animation = applyGlobalFilters(deduplicate([
      ...animMovies.map(normalizeMovies),
      ...animSeries.map(normalizeSeries)
    ]))
    const fantasy = applyGlobalFilters(deduplicate([
      ...fanMovies.map(normalizeMovies),
      ...fanSeries.map(normalizeSeries)
    ]))
    const music = applyGlobalFilters(deduplicate([
      ...musMovies.map(normalizeMovies),
      ...musSeries.map(normalizeSeries)
    ]))
    const scifi = applyGlobalFilters(deduplicate([
      ...sciMovies.map(normalizeMovies),
      ...sciSeries.map(normalizeSeries)
    ]))

    return [
      { type: "movie_hub" },
      { type: "series_hub" },
      { type: "continue_watching" },
      { title: "K-Drama", data: kdramas, cardType: "poster" },
      { title: "C-Drama", data: cdramas, cardType: "poster" },
      { title: "J-Drama", data: jdramas, cardType: "poster" },
      { title: "Asian Drama", data: asianDramas, cardType: "poster" },
      { title: "Anime", data: animes, cardType: "poster" },
      { title: "Animation", data: animation, cardType: "poster" },
      { title: "Documentaries", data: docs, cardType: "landscape" },
      { title: "Fantasy", data: fantasy, cardType: "poster" },
      { title: "Music", data: music, cardType: "landscape" },
      { title: "Sci-Fi", data: scifi, cardType: "poster" },
    ].filter(section => section.type || (section.data && section.data.length > 0))
  }, [
    kdrama, cdrama, jdrama, asianDrama, anime, documentary,
    animMovies, animSeries, fanMovies, fanSeries, musMovies, musSeries, sciMovies, sciSeries,
    excludedCountries, filterLanguage, selectedPlatforms, filterYear
  ])

  const featuredItem = useMemo(() => {
    const trendingList = applyGlobalFilters(trendingData.map(normalizeTrending))
    return trendingList[0] || null
  }, [trendingData, excludedCountries, filterLanguage, selectedPlatforms, filterYear])

  const renderHeroBanner = () => {
    if (!featuredItem) return null
    return (
      <View style={[styles.heroContainer, { borderColor: theme.border }]}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/original${featuredItem.backdrop || featuredItem.poster}` }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)", theme.background]}
          style={styles.heroGradient}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle} numberOfLines={1}>
            {featuredItem.title}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" fill="#FFD700" style={{ marginRight: 4 }} />
            <Text style={styles.heroSubtitle}>
              {featuredItem.rating.toFixed(1)}  •  {featuredItem.type === "movie" ? "Movie" : "Series"}
            </Text>
          </View>
          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={[styles.playBtn, { backgroundColor: accentColor }]}
              onPress={() => navigation.dispatch(StackActions.push("Details", { id: featuredItem.id, type: featuredItem.type }))}
              activeOpacity={0.8}
            >
              <Play size={14} color="#FFF" style={{ marginRight: 6 }} fill="#FFF" />
              <Text style={styles.playBtnText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.listBtn, { borderColor: "rgba(255,255,255,0.4)", borderWidth: 1 }]}
              activeOpacity={0.8}
            >
              <Plus size={14} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.listBtnText}>My List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const renderSectionSlider = ({ item }: { item: any }) => {
    if (item.type === "movie_hub") {
      return (
        <MovieHub
          nowPlaying={normalizedMoviesData.nowPlaying}
          popular={normalizedMoviesData.popular}
          topRated={normalizedMoviesData.topRated}
          upcoming={normalizedMoviesData.upcoming}
        />
      )
    }
    if (item.type === "series_hub") {
      return (
        <SeriesHub
          airingToday={normalizedSeriesData.airingToday}
          popular={normalizedSeriesData.popular}
          topRated={normalizedSeriesData.topRated}
          onTheAir={normalizedSeriesData.onTheAir}
        />
      )
    }
    if (item.type === "continue_watching") {
      const continueWatchingList = [
        {
          id: 550,
          title: "Fight Club",
          backdrop: "/f7RISK24zT2Vl5E9I32v294yF0d.jpg",
          type: "movie",
          progress: 0.65,
          subtitle: "44m left"
        },
        {
          id: 1396,
          title: "Breaking Bad",
          backdrop: "/9fa5tG2c27V1Q2O1hG8jT10b904.jpg",
          type: "series",
          progress: 0.82,
          subtitle: "S3:E8 • 8m left"
        },
        {
          id: 299534,
          title: "Avengers: Endgame",
          backdrop: "/7RyGsL12Z67v77j7W1A4d914Y0d.jpg",
          type: "movie",
          progress: 0.28,
          subtitle: "1h 55m left"
        }
      ]

      return (
        <View style={styles.section}>
          <SectionHeader title="Continue Watching" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.continueWatchingScroll}
          >
            {continueWatchingList.map((media) => (
              <Pressable
                key={media.id}
                style={[styles.continueCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => navigation.dispatch(StackActions.push("Details", { id: media.id, type: media.type }))}
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${media.backdrop}` }}
                    style={styles.continueBackdrop}
                  />
                  {/* Play Button Overlay */}
                  <View style={styles.playOverlay}>
                    <View style={[styles.miniPlayCircle, { backgroundColor: accentColor }]}>
                      <Play size={10} color="#FFF" fill="#FFF" />
                    </View>
                  </View>
                </View>
                {/* Progress bar and text */}
                <View style={styles.continueMeta}>
                  <Text style={[styles.continueTitle, { color: theme.foreground }]} numberOfLines={1}>{media.title}</Text>
                  <Text style={[styles.continueSubtitle, { color: theme.muted }]}>{media.subtitle}</Text>
                </View>
                <View style={[styles.progressBarContainer, { backgroundColor: `${theme.foreground}20` }]}>
                  <View style={[styles.progressBar, { width: `${media.progress * 100}%`, backgroundColor: accentColor }]} />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )
    }
    return (
      <View style={styles.section}>
        <SectionHeader title={item.title} />
        <MediaSlider data={item.data} type={item.cardType as any} />
      </View>
    )
  }

  const activeBlurMethod = (blurTarget && blurTarget.current) ? "dimezisBlurView" : "none"

  return (
    <Container>
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[theme.background, `${theme.background}E6`, "transparent"]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.headerContentWrapper}>
          <View style={styles.headerLeft}>
            <Film size={22} color={accentColor} />
            <Text style={[styles.headerTitle, { color: theme.foreground }]}>FabPrime</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: theme.card + "aa" }]}
              onPress={() => navigation.navigate("Search" as any)}
              activeOpacity={0.7}
            >
              <Search size={18} color={theme.foreground} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: theme.card + "aa" }]}
              activeOpacity={0.7}
            >
              <Bell size={18} color={theme.foreground} />
              <View style={[styles.notificationDot, { backgroundColor: accentColor, borderColor: theme.background }]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: theme.card + "aa", overflow: "hidden" }]}
              onPress={() => navigation.navigate("Profile" as any)}
              activeOpacity={0.7}
            >
              {user?.photo ? (
                <Image source={{ uri: user.photo }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />
              ) : (
                <User size={18} color={theme.foreground} />
              )}
            </TouchableOpacity>
          </View>
        </View>

      </View>

      <FlatList
        data={computedSections}
        renderItem={renderSectionSlider}
        keyExtractor={(item, index) => item.type ? item.type : `${item.title}-${index}`}
        ListHeaderComponent={renderHeroBanner}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 72 }]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 10,
  },
  headerContentWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "ClashGrotesk-Bold",
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 110,
  },
  slidersContainer: {
    paddingTop: 10,
    gap: 20,
  },
  section: {
    marginBottom: 5,
  },
  heroContainer: {
    width: "100%",
    height: 220,
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 0,
    marginBottom: 0,
    borderWidth: 1,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  heroContent: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
    alignItems: "flex-start",
    gap: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: "ClashGrotesk-Bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: "GeneralSans-Semibold",
    color: "rgba(255, 255, 255, 0.8)",
  },
  heroButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
  },
  playBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "GeneralSans-Bold",
  },
  listBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  listBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "GeneralSans-Bold",
  },
  continueWatchingScroll: {
    paddingHorizontal: 16,
    gap: 14,
    paddingBottom: 0,
    paddingTop: 10
  },
  continueCard: {
    width: 200,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
  },
  continueBackdrop: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
  },
  playOverlay: {
    ...StyleSheet.absoluteFill,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  miniPlayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  continueMeta: {
    padding: 10,
  },
  continueTitle: {
    fontSize: 13,
    fontFamily: "GeneralSans-Semibold",
  },
  continueSubtitle: {
    fontSize: 11,
    fontFamily: "GeneralSans-Medium",
    marginTop: 2,
  },
  progressBarContainer: {
    height: 3,
    width: "100%",
  },
  progressBar: {
    height: "100%",
  }
})
