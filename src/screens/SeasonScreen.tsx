import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Image, FlatList } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { NativeGradient } from '../components/native/NativeGradient'
import { ChevronLeft, Calendar, Clock } from 'lucide-react-native'
import { Text } from '../components/ui/Text'
import { getSeasonDetails } from '../api/tmdb'
import { useTheme } from '../theme/ThemeContext'
import { Skeleton } from '../components/ui/Skeleton'
import { Container } from '../components/ui/Container'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'
const STILL_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export function SeasonScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const { tvId, seasonNumber, showName } = route.params

  const [season, setSeason] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getSeasonDetails(tvId, seasonNumber)
      .then(res => setSeason(res))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [tvId, seasonNumber])

  if (loading) {
    return (
      <Container style={[styles.container, { backgroundColor: theme.background }]}>
        <Skeleton width="100%" height={300} />
        <View style={styles.padding}>
          <Skeleton width="60%" height={32} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={20} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={20} />
        </View>
      </Container>
    )
  }

  if (!season) return <Container style={[styles.container, { backgroundColor: theme.background }]} />

  const posterImage = season.poster_path ? `${IMAGE_BASE_URL}${season.poster_path}` : null
  const year = season.air_date ? season.air_date.substring(0, 4) : ''

  const renderEpisode = ({ item }: { item: any }) => {
    const stillImage = item.still_path ? `${STILL_BASE_URL}${item.still_path}` : null
    
    return (
      <View style={[styles.episodeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {stillImage ? (
          <Image source={{ uri: stillImage }} style={styles.episodeImage} resizeMode="cover" />
        ) : (
          <View style={[styles.episodeImage, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
            <Text color={theme.muted}>No Image</Text>
          </View>
        )}
        <View style={styles.episodeContent}>
          <Text weight="bold" size={16} numberOfLines={2}>
            {item.episode_number}. {item.name}
          </Text>
          <View style={styles.episodeMeta}>
            {item.air_date && (
              <View style={styles.metaBadge}>
                <Calendar size={12} color={theme.muted} />
                <Text size={12} color={theme.muted} style={{ marginLeft: 4 }}>{item.air_date}</Text>
              </View>
            )}
            {item.runtime > 0 && (
              <View style={styles.metaBadge}>
                <Clock size={12} color={theme.muted} />
                <Text size={12} color={theme.muted} style={{ marginLeft: 4 }}>{item.runtime}m</Text>
              </View>
            )}
          </View>
          {item.overview ? (
            <Text size={13} color={theme.muted} numberOfLines={3} style={{ marginTop: 8 }}>
              {item.overview}
            </Text>
          ) : null}
        </View>
      </View>
    )
  }

  return (
    <Container useSafeArea={true}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View style={styles.header}>
          {posterImage ? (
            <ImageBackground source={{ uri: posterImage }} style={styles.image} blurRadius={10}>
              <NativeGradient
                colors={["rgba(0,0,0,0.5)", "transparent", theme.background]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View style={styles.gradient}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <ChevronLeft color={theme.foreground} size={28} />
                </TouchableOpacity>
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
          <View style={styles.titleRow}>
            {posterImage && (
              <Image source={{ uri: posterImage }} style={styles.posterThumb} />
            )}
            <View style={styles.titleInfo}>
              <Text color={theme.muted} size={14} style={{ marginBottom: 4 }}>{showName}</Text>
              <Text weight="bold" size={28}>{season.name}</Text>
              <Text color={theme.muted} style={{ marginTop: 4 }}>
                {year} {year && season.episodes?.length ? '•' : ''} {season.episodes?.length || 0} Episodes
              </Text>
            </View>
          </View>

          {season.overview ? (
            <View style={styles.overviewSection}>
              <Text style={styles.overview} color={theme.muted}>{season.overview}</Text>
            </View>
          ) : null}

          <View style={styles.episodesSection}>
            <Text weight="bold" size={20} style={styles.sectionTitle}>Episodes</Text>
            {season.episodes?.map((ep: any) => (
              <View key={ep.id}>
                {renderEpisode({ item: ep })}
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
      <NativeGradient
        colors={["transparent", "transparent", theme.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { width: '100%', height: 250 },
  image: { width: '100%', height: '100%' },
  gradient: { flex: 1, justifyContent: 'space-between' },
  backButton: { padding: 20, marginTop: 10 },
  content: { padding: 16, marginTop: -40, paddingBottom: 60 },
  padding: { padding: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 24, zIndex: 10 },
  posterThumb: { width: 100, height: 150, borderRadius: 8, marginRight: 16, marginTop: -60 },
  titleInfo: { flex: 1, paddingBottom: 4 },
  overviewSection: { marginBottom: 32 },
  overview: { lineHeight: 22 },
  episodesSection: { marginTop: 8 },
  sectionTitle: { marginBottom: 16 },
  episodeCard: { flexDirection: 'row', borderRadius: 12, overflow: 'hidden', marginBottom: 16, borderWidth: 1 },
  episodeImage: { width: 120, height: '100%', aspectRatio: 16/9 },
  episodeContent: { flex: 1, padding: 12, justifyContent: 'center' },
  episodeMeta: { flexDirection: 'row', marginTop: 8, gap: 12 },
  metaBadge: { flexDirection: 'row', alignItems: 'center' }
})
