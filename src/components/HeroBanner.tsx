import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { Play, Plus, Check, Heart } from 'lucide-react-native'
import { Text } from './ui/Text'
import { useFavorites } from '../store/FavoritesContext'
import { getTrending } from '../api/tmdb'
import { TMDBMedia } from '../types/tmdb'
import { useTheme } from '../theme/ThemeContext'
import { accents } from '../theme/accents'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

export function HeroBanner() {
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites()
  const [heroMedia, setHeroMedia] = useState<TMDBMedia | null>(null)
  const [fav, setFav] = useState(false)
  const { theme, accentColor } = useTheme()
  const navigation = useNavigation<any>()

  useEffect(() => {
    // Priority: Random Favorite -> Trending
    if (favorites.length > 0) {
      const randomFav = favorites[Math.floor(Math.random() * favorites.length)]
      setHeroMedia(randomFav)
    }
    // else {
    //   getTrending().then(res => {
    //     if (res.results && res.results.length > 0) {
    //       setHeroMedia(res.results[0])
    //     }
    //   }).catch(console.error)
    // }
    else return
  }, [favorites])

  if (!heroMedia) return <View style={styles.placeholder} />

  const imageUrl = heroMedia.backdrop_path ? `${IMAGE_BASE_URL}${heroMedia.backdrop_path}` : null
  const title = heroMedia.title || heroMedia.name || heroMedia.original_title || heroMedia.original_name
  const isFav = isFavorite(heroMedia.id)

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(heroMedia.id)
    } else {
      addFavorite(heroMedia)
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => {
        if (heroMedia) {
          navigation.navigate('Details', {
            id: heroMedia.id,
            type: heroMedia.media_type || (heroMedia.title ? 'movie' : 'tv')
          })
        }
      }}
    >
      {imageUrl ? (
        <ImageBackground source={{ uri: imageUrl }} style={styles.image}>
          <LinearGradient
            colors={['transparent', 'transparent', 'transparent', 'transparent', theme.background]}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <Text weight="bold" size={22} style={[styles.title, { color: theme.foreground, textShadowColor: theme.background + "80", }]} numberOfLines={1}>
                {title}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.playButton, { boxShadow: `0px 0px 10px ${theme.foreground}, inset 0px 0px 10px ${theme.foreground}` }]}
                  onPress={() => {
                    if (heroMedia) {
                      navigation.navigate('Details', {
                        id: heroMedia.id,
                        type: heroMedia.media_type || (heroMedia.title ? 'movie' : 'tv')
                      })
                    }
                  }}
                >
                  <Play color={theme.foreground} size={24} fill={theme.foreground} />
                  <Text weight="bold" style={[styles.playText, { color: theme.foreground }]}>Play</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity style={[styles.actionButton]} onPress={() => setFav(prev => prev == true ? false : true)}>
                    <Heart color={accents.rose} size={34} strokeWidth={1} fill={fav ? accents.rose : "#ffffff00"} />
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionButton]} onPress={toggleFavorite}>
                    {isFav ? <Check color={theme.foreground} size={24} /> : <Plus color={theme.foreground} size={24} />}
                    <Text style={[styles.actionText, { color: theme.foreground }]}>My List</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      ) : (
        <View style={styles.placeholder} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 2.7 / 3,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    textAlign: "left",
    marginBottom: 16,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    width: "100%",
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 0
  },
  playButton: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: "flex-start",
    gap: 8,
    borderWidth: 0.011,
  },
  playText: {
    fontSize: 18,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  placeholder: {
    width: '100%',
    aspectRatio: 2.7 / 3,
    backgroundColor: '#2a2a2a',
    marginBottom: 20,
  }
})
