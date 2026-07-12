import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { NativeGradient } from '../components/native/NativeGradient'
import { Star, ChevronLeft, Heart, Bookmark, Download } from 'lucide-react-native'
import { Text } from '../components/ui/Text'
import { AlertModal } from '../components/ui/AlertModal'
import { getMediaDetails } from '../api/tmdb'
import { downloadMediaPackage } from '../utils/zipDownloader'
import { useFavorites } from '../store/FavoritesContext'
import { useWatchlist } from '../store/WatchlistContext'
import { useHistory } from '../store/HistoryContext'
import { useTheme } from '../theme/ThemeContext'
import { Skeleton } from '../components/ui/Skeleton'
import { CastCard } from '../components/cards/CastCard'
import { VideoCard } from '../components/cards/VideoCard'
import { ImageGallery } from '../components/gallery/ImageGallery'
import { NativeMediaList } from '../components/native/NativeMediaList'
import { Container } from '../components/ui/Container'
import Wave from '../animations/Wave'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

export function DetailScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { theme, accentColor } = useTheme()
  const { id, type } = route.params

  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { inWatchlist, addWatchlist, removeWatchlist } = useWatchlist()
  const { addHistory } = useHistory()

  const [details, setDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [overviewExpanded, setOverviewExpanded] = useState(false)

  const [isDownloadingZip, setIsDownloadingZip] = useState(false)
  const [downloadProgressText, setDownloadProgressText] = useState('')
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [alertConfig, setAlertConfig] = useState<{ visible: boolean, title: string, message: string, type: 'success' | 'error' | 'info' }>({
    visible: false, title: '', message: '', type: 'info'
  })

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true)
      setDownloadStatus('idle')
      const path = await downloadMediaPackage(details, (text, current, total) => {
        if (total > 1) {
          setDownloadProgressText(`${text} (${current}/${total})`)
        } else {
          setDownloadProgressText(text)
        }
      })
      setDownloadStatus('success')
      setAlertConfig({
        visible: true,
        title: 'Success!',
        message: `Media package downloaded successfully!\nSaved to:\n${path}`,
        type: 'success'
      })
      setTimeout(() => setDownloadStatus('idle'), 3000)
    } catch (e: any) {
      setDownloadStatus('error')
      setAlertConfig({
        visible: true,
        title: 'Download Failed',
        message: e.message || 'An error occurred while building the ZIP.',
        type: 'error'
      })
      setTimeout(() => setDownloadStatus('idle'), 3000)
    } finally {
      setIsDownloadingZip(false)
      setDownloadProgressText('')
    }
  }

  useEffect(() => {
    setLoading(true)
    getMediaDetails(id, type)
      .then(res => {
        setDetails(res)
        // Log history
        addHistory({
          id: res.id,
          title: res.title || res.name,
          poster_path: res.poster_path,
          vote_average: res.vote_average,
          overview: res.overview,
        } as any)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id, type])

  if (loading) {
    return (
      <Container style={[styles.container, { backgroundColor: theme.background }]}>
        <Skeleton width="100%" height={400} />
        <View style={styles.padding}>
          <Skeleton width="60%" height={32} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={20} style={{ marginBottom: 8 }} />
          <Skeleton width="100%" height={20} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={20} />
        </View>
      </Container>
    )
  }

  if (!details) return <Container style={[styles.container, { backgroundColor: theme.background }]} />

  const isFav = isFavorite(id)
  const toggleFavorite = () => {
    if (isFav) removeFavorite(details.id)
    else addFavorite(details)
  }

  const isWatch = inWatchlist(id)
  const toggleWatchlist = () => {
    if (isWatch) removeWatchlist(details.id)
    else addWatchlist(details)
  }

  // Safe data extraction
  const posterImage = details.poster_path ? `${IMAGE_BASE_URL}${details.poster_path}` : null
  const imageUrl = details.backdrop_path ? `${IMAGE_BASE_URL}${details.backdrop_path}` : null

  // Titles
  const mainTitle = details.title || details.name
  const originalTitle = details.original_title || details.original_name
  const showOriginalTitle = originalTitle && originalTitle !== mainTitle

  const year = (details.release_date || details.first_air_date || '').substring(0, 4)
  const runtime = details.runtime ? `${details.runtime} min` : details.number_of_seasons ? `${details.number_of_seasons} Seasons` : ''
  const cast = details.credits?.cast || []
  const crew = details.credits?.crew || []
  const videos = details.videos?.results || []
  const recommendations = details.recommendations?.results || []
  const similar = details.similar?.results || []

  // Specific crew
  const directors = crew.filter((c: any) => c.job === 'Director')
  const composers = crew.filter((c: any) => c.job === 'Original Music Composer' || c.job === 'Music')
  const creators = details.created_by || []

  const handleItemPress = (event: any) => {
    const { id: mediaId } = event.nativeEvent;
    const media = recommendations.find((m: any) => m.id === mediaId) || similar.find((m: any) => m.id === mediaId);
    navigation.push('Details', { id: mediaId, type: media?.media_type || event.nativeEvent.mediaType || type });
  }

  return (
    <Container useSafeArea={true}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>

        {/* HERO SECTION */}
        <View style={styles.header}>
          {imageUrl ? (
            <ImageBackground source={{ uri: imageUrl as string }} style={[styles.image]}>
              <NativeGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0)", theme.background]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.gradient}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <ChevronLeft color={"#FFF"} size={28} />
                </TouchableOpacity>
              </View>
              <View style={styles.heroPosterContainer}>
                <Image
                  source={{ uri: posterImage as string }}
                  style={styles.heroPoster}
                />
              </View>
            </ImageBackground>
          ) : (
            <View style={[styles.image, { backgroundColor: theme.card }]}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <ChevronLeft color={theme.foreground} size={28} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text weight="bold" size={36} style={styles.title}>{mainTitle || originalTitle}</Text>
          {showOriginalTitle && (
            <Text weight="semibold" size={16} color={theme.muted} style={{ marginBottom: 12, marginTop: -4 }}>
              ({originalTitle})
            </Text>
          )}
          {details.tagline ? <Text color={theme.muted} style={styles.tagline}>"{details.tagline}"</Text> : null}

          {/* QUICK INFO */}
          <View style={styles.meta}>
            {year ? <Text color={theme.muted}>{year}</Text> : null}
            {year && runtime ? <Text color={theme.muted}> • </Text> : null}
            {runtime ? <Text color={theme.muted}>{runtime}</Text> : null}
            {details.status ? (
              <>
                <Text color={theme.muted}> • </Text>
                <Text color={theme.muted}>{details.status}</Text>
              </>
            ) : null}
            {details.vote_average ? (
              <>
                <Text color={theme.muted}> • </Text>
                <View style={styles.ratingRow}>
                  <Star size={14} color="#f5c518" fill="#f5c518" />
                  <Text color={theme.muted}>{details.vote_average.toFixed(1)}</Text>
                </View>
              </>
            ) : null}
          </View>

          {/* GENRES */}
          <View style={styles.genresRow}>
            {details.genres?.map((g: any) => (
              <View key={g.id} style={[styles.genrePill, { backgroundColor: theme.card }]}>
                <Text size={12}>{g.name}</Text>
              </View>
            ))}
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: isFav ? theme.card : theme.foreground }]} onPress={toggleFavorite}>
              <Heart color={isFav ? "red" : theme.background} size={20} fill={isFav ? "red" : "transparent"} />
              <Text weight="bold" color={isFav ? theme.foreground : theme.background}>
                {isFav ? 'Favorited' : 'Favorite'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: isWatch ? theme.card : theme.foreground }]} onPress={toggleWatchlist}>
              <Bookmark color={isWatch ? theme.foreground : theme.background} size={20} fill={isWatch ? theme.foreground : "transparent"} />
              <Text weight="bold" color={isWatch ? theme.foreground : theme.background}>
                {isWatch ? 'Watchlisted' : 'Watchlist'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: downloadStatus === 'success' ? '#10b981' : downloadStatus === 'error' ? '#ef4444' : theme.card,
                marginBottom: 24,
                paddingVertical: 18
              }
            ]}
            onPress={handleDownloadZip}
            disabled={isDownloadingZip}
          >
            {isDownloadingZip ? (
              <>
                <Text weight="bold" color={downloadStatus !== 'idle' ? '#fff' : theme.foreground}>{downloadProgressText}</Text>
                <Wave size={20} color={accentColor} />
              </>
            ) : (
              <>
                <Download color={downloadStatus !== 'idle' ? '#fff' : theme.foreground} size={20} />
                <Text weight="bold" color={downloadStatus !== 'idle' ? '#fff' : theme.foreground}>
                  {downloadStatus === 'success' ? 'Downloaded!' : downloadStatus === 'error' ? 'Failed' : 'Download Media Package (.zip)'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* OVERVIEW */}
          <Text style={styles.sectionHeader} weight="bold" size={20}>Overview</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setOverviewExpanded(!overviewExpanded)}>
            <Text
              style={styles.overview}
              color={theme.muted}
              numberOfLines={overviewExpanded ? undefined : 4}
            >
              {details.overview || 'No overview available.'}
            </Text>
            {details.overview && details.overview.length > 150 && (
              <Text weight="bold" style={{ color: accentColor, marginTop: 4 }}>
                {overviewExpanded ? "Show Less" : "Read More"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* EXTENDED INFO (Budget, Language, Countries) */}
        <View style={[styles.statsGrid, { borderTopColor: theme.border }]}>
          <View style={styles.statBox}>
            <Text size={12} color={theme.muted}>Language</Text>
            <Text weight="bold">{details.original_language?.toUpperCase() || 'N/A'}</Text>
          </View>
          <View style={styles.statBox}>
            <Text size={12} color={theme.muted}>Budget</Text>
            <Text weight="bold">{details.budget ? `$${(details.budget / 1000000).toFixed(1)}M` : 'N/A'}</Text>
          </View>
          <View style={styles.statBox}>
            <Text size={12} color={theme.muted}>Revenue</Text>
            <Text weight="bold">{details.revenue ? `$${(details.revenue / 1000000).toFixed(1)}M` : 'N/A'}</Text>
          </View>
        </View>

        {/* Production company */}
        {details.production_companies?.length > 0 && (
          <View style={styles.infoSection}>
            <Text weight="bold" size={16} style={{ marginBottom: 12 }}>Production Companies</Text>
            <View style={styles.companyGrid}>
              {details.production_companies.map((c: any) => (
                <View key={c.id} style={[styles.companyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  {c.logo_path ? (
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w200${c.logo_path}` }} style={styles.companyLogo} resizeMode="contain" />
                  ) : null}
                  <Text size={12} weight="medium" style={{ marginLeft: c.logo_path ? 8 : 0 }}>{c.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {details.production_countries?.length > 0 && (
          <View style={styles.infoSection}>
            <Text weight="bold" size={16} style={{ marginBottom: 12 }}>Production Countries</Text>
            <View style={styles.countryGrid}>
              {details.production_countries.map((c: any) => (
                <View key={c.iso_3166_1} style={[styles.countryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Image source={{ uri: `https://flagcdn.com/w80/${c.iso_3166_1.toLowerCase()}.png` }} style={styles.countryFlag} />
                  <Text size={12} weight="medium">{c.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* CAST */}
        {cast.length > 0 && (
          <View style={styles.section}>
            <Text weight="bold" size={20} style={styles.sectionTitle}>Cast</Text>
            <FlatList
              data={cast.slice(0, 20)}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => <CastCard person={item} />}
            />
          </View>
        )}

        {/* MUSIC / SOUNDTRACK */}
        {composers.length > 0 && (
          <View style={styles.section}>
            <Text weight="bold" size={20} style={styles.sectionTitle}>Music & Soundtrack By</Text>
            <FlatList
              data={composers}
              keyExtractor={(item, idx) => item.id.toString() + idx}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => <CastCard person={item} />}
            />
          </View>
        )}

        {/* SEASONS (TV Only) */}
        {type === 'tv' && details.seasons && (
          <View style={styles.section}>
            <Text weight="bold" size={20} style={styles.sectionTitle}>Seasons</Text>
            <FlatList
              data={details.seasons}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.seasonCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Season', { tvId: details.id, seasonNumber: item.season_number, showName: item.title })}
                >
                  {item.poster_path ? (
                    <ImageBackground source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }} style={styles.seasonImage} imageStyle={{ borderRadius: 8 }}>
                      <View style={styles.seasonOverlay}>
                        <Text weight="bold" size={14} style={styles.textShadow}>{item.name}</Text>
                        <Text size={12}>{item.episode_count} Episodes</Text>
                      </View>
                    </ImageBackground>
                  ) : (
                    <View style={[styles.seasonImage, { backgroundColor: theme.card, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }]}>
                      <Text weight="bold" size={14}>{item.name}</Text>
                      <Text size={12}>{item.episode_count} Eps</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* TRAILERS & VIDEOS */}
        {videos.length > 0 && (
          <View style={[styles.section]}>
            <Text weight="bold" size={20} style={styles.sectionTitle}>Trailers & Videos</Text>
            <FlatList
              data={videos}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => <VideoCard video={item} />}
            />
          </View>
        )}

        {/* IMAGES */}
        {details.images && <ImageGallery images={details.images} />}

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text weight="bold" size={20} style={styles.sectionTitle}>Recommended</Text>
            <NativeMediaList
              data={recommendations.map((m: any) => ({ ...m, mediaType: m.media_type || type }))}
              isGrid={false}
              isHorizontalCard={false}
              onItemPress={handleItemPress}
              style={{ width: '100%', height: 168 }}
            />
          </View>
        )}

        {/* SIMILAR */}
        {similar.length > 0 && (
          <View style={[styles.section, { marginBottom: 60 }]}>
            <Text weight="bold" size={20} style={styles.sectionTitle}>Similar</Text>
            <NativeMediaList
              data={similar.map((m: any) => ({ ...m, mediaType: m.media_type || type }))}
              isGrid={false}
              isHorizontalCard={false}
              onItemPress={handleItemPress}
              style={{ width: '100%', height: 168 }}
            />
          </View>
        )}

      </ScrollView>
      <NativeGradient
        colors={[theme.background, "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padding: {
    padding: 20,
  },
  header: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 300,
  },
  heroPosterContainer: {
    position: "absolute",
    left: 20,
    bottom: -60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  heroPoster: {
    borderRadius: 12,
    aspectRatio: 2 / 3,
    minWidth: 120,
    minHeight: 180,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  gradient: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 24,
  },
  title: {
    marginBottom: 20,
    minHeight: 75,
    width: "auto"
  },
  tagline: { fontStyle: 'italic', marginBottom: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  genrePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  loadingIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-550%" }],
  },
  sectionHeader: { marginBottom: 12 },
  overview: { lineHeight: 24, marginBottom: 24 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth, marginHorizontal: 0, marginBottom: 16 },
  statBox: { alignItems: 'center' },
  infoRow: { flexDirection: 'row', paddingHorizontal: 0, marginBottom: 8 },
  infoLabel: { width: 100 },
  infoValue: { flex: 1, fontWeight: '500' },
  infoSection: { paddingHorizontal: 20, marginBottom: 24 },
  companyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  companyCard: { flexDirection: 'row', padding: 8, paddingHorizontal: 16, borderRadius: 50, borderWidth: 1, alignItems: 'center' },
  companyLogo: { width: 40, height: 20 },
  countryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  countryCard: { flexDirection: 'row', alignItems: 'center', padding: 8, paddingHorizontal: 16, borderRadius: 50, borderWidth: 1, gap: 8 },
  countryFlag: { width: 24, height: 16, borderRadius: 2 },
  section: {
    marginTop: 32,
    paddingHorizontal: 0
  },
  sectionTitle: { marginLeft: 20, marginBottom: 16 },
  listContent: { paddingHorizontal: 16, gap: 12 },
  seasonCard: { width: 120, height: 180, marginRight: 12 },
  seasonImage: { width: '100%', height: '100%' },
  seasonOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0)', borderRadius: 8, justifyContent: 'flex-end', padding: 8 },
  textShadow: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
})
