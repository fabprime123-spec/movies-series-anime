import { View, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native"
import { Container } from "../components/ui/Container"
import { MediaSlider } from "../components/sliders/MediaSlider"
import { SectionHeader } from "../components/headers/SectionHeader"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { useNavigation, StackActions } from "@react-navigation/native"
import { Play, Plus, User, Search, Bell, Star, Film } from "lucide-react-native"
import { Text } from "../components/ui/Text"
import { useMemo } from "react"
import { MovieHub } from "../components/Home/MovieHub"
import { SeriesHub } from "../components/Home/SeriesHub"

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
      nowPlaying: nowPlayingMovies.map(normalizeMovies),
      popular: popularMovies.map(normalizeMovies),
      topRated: topRatedMovies.map(normalizeMovies),
      upcoming: upcomingMovies.map(normalizeMovies)
    }
  }, [nowPlayingMovies, popularMovies, topRatedMovies, upcomingMovies])

  const normalizedSeriesData = useMemo(() => {
    return {
      airingToday: airingTodaySeries.map(normalizeSeries),
      popular: popularSeries.map(normalizeSeries),
      topRated: topRatedSeries.map(normalizeSeries),
      onTheAir: onTheAirSeries.map(normalizeSeries)
    }
  }, [airingTodaySeries, popularSeries, topRatedSeries, onTheAirSeries])

  // Use useMemo to cache computed and normalized data
  const computedSections = useMemo(() => {
    const kdramas = kdrama.map(normalizeSeries)
    const cdramas = cdrama.map(normalizeSeries)
    const jdramas = jdrama.map(normalizeSeries)
    const asianDramas = asianDrama.map(normalizeSeries)
    const animes = anime.map(normalizeSeries)
    const docs = documentary.map(normalizeMedia)

    const animation = deduplicate([
      ...animMovies.map(normalizeMovies),
      ...animSeries.map(normalizeSeries)
    ])
    const fantasy = deduplicate([
      ...fanMovies.map(normalizeMovies),
      ...fanSeries.map(normalizeSeries)
    ])
    const music = deduplicate([
      ...musMovies.map(normalizeMovies),
      ...musSeries.map(normalizeSeries)
    ])
    const scifi = deduplicate([
      ...sciMovies.map(normalizeMovies),
      ...sciSeries.map(normalizeSeries)
    ])

    return [
      { type: "movie_hub" },
      { type: "series_hub" },
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
    animMovies, animSeries, fanMovies, fanSeries, musMovies, musSeries, sciMovies, sciSeries
  ])

  const featuredItem = useMemo(() => {
    const trendingList = trendingData.map(normalizeTrending)
    return trendingList[0] || null
  }, [trendingData])

  const renderHeroBanner = () => {
    if (!featuredItem) return null
    return (
      <View style={[styles.heroContainer, { borderColor: theme.border }]}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w780${featuredItem.backdrop || featuredItem.poster}` }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)", theme.background, theme.background]}
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
    return (
      <View style={styles.section}>
        <SectionHeader title={item.title} />
        <MediaSlider data={item.data} type={item.cardType as any} />
      </View>
    )
  }

  const isDark = theme.background === "#000000"
  const baseColor = isDark ? "0,0,0" : "255,255,255"
  return (
    <Container>
      <View style={styles.headerContainer}>
        {blurTarget?.current ? (
          <BlurView
            intensity={mode === "dark" ? 50 : 75}
            tint={mode === "dark" ? "dark" : "light"}
            blurMethod="dimezisBlurView"
            blurTarget={blurTarget}
            style={[StyleSheet.absoluteFill, { backgroundColor: mode === "dark" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)" }]}
          />
        ) : (
          <LinearGradient
            colors={[
              `rgba(${baseColor}, 0.92)`,
              `rgba(${baseColor}, 0.72)`,
              `rgba(${baseColor}, 0.28)`,
              "transparent"
            ]}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={styles.headerContentWrapper}>
          <View style={styles.headerLeft}>
            <Film size={22} color={accentColor} />
            <Text style={[styles.headerTitle, { color: theme.foreground }]}>FabPrime</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: theme.card }]}
              onPress={() => navigation.navigate("Search" as any)}
              activeOpacity={0.7}
            >
              <Search size={18} color={theme.foreground} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: theme.card }]}
              activeOpacity={0.7}
            >
              <Bell size={18} color={theme.foreground} />
              <View style={[styles.notificationDot, { backgroundColor: accentColor, borderColor: theme.background }]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: theme.card, overflow: "hidden" }]}
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
        contentContainerStyle={[styles.scrollContent, { paddingTop: 64 }]}
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
    height: 72,
    zIndex: 10,
    overflow: "hidden",
  },
  headerContentWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
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
    marginBottom: 10,
  },
  heroContainer: {
    width: "100%",
    height: 220,
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 12,
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
  }
})
