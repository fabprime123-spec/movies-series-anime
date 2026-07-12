import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeGradient } from './native/NativeGradient'
import { Play, Plus, Check, Heart } from 'lucide-react-native'
import { Text } from './ui/Text'
import { useFavorites } from '../store/FavoritesContext'
import { TMDBMedia } from '../types/tmdb'
import { useTheme } from '../theme/ThemeContext'
import { accents } from '../theme/accents'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

export function HeroBanner() {
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites()
  const [heroMedia, setHeroMedia] = useState<TMDBMedia | null>(null)
  const { theme, accentColor, dimensions } = useTheme()
  const navigation = useNavigation<any>()

  useEffect(() => {
    // Priority: Random Favorite -> Trending
    if (favorites.length > 0) {
      const randomFav = favorites[Math.floor(Math.random() * favorites.length)]
      setHeroMedia(randomFav)
    }
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
        <ImageBackground source={{ uri: imageUrl }} style={[styles.image]}>
          <NativeGradient
            colors={["transparent", "transparent", theme.background + "aa", theme.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.gradient}>
            <View style={styles.content}>
              <Text weight="semibold" size={36} style={[styles.title, { color: theme.foreground, textShadowColor: theme.background + "aa", textShadowRadius: 10 }]} numberOfLines={2}>
                {title}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.playButton, { backgroundColor: accentColor, shadowColor: accentColor, shadowOpacity: 0.8, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8 }]}
                  onPress={() => {
                    if (heroMedia) {
                      navigation.navigate('Details', {
                        id: heroMedia.id,
                        type: heroMedia.media_type || (heroMedia.title ? 'movie' : 'tv')
                      })
                    }
                  }}
                >
                  <Play color={"#FFF"} size={22} fill={"#FFF"} />
                  <Text weight="bold" style={[styles.playText, { color: theme.foreground }]}>Play</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton]} onPress={toggleFavorite}>
                  <Heart color={isFavorite(heroMedia.id) ? "#ff00a0" : theme.foreground} size={36} strokeWidth={1} fill={isFavorite(heroMedia.id) ? "#ff00a0" : "transparent"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    alignItems: "center"
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
    paddingHorizontal: 26,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    textAlign: "left",
    marginBottom: 20,
    width: "100%",
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    justifyContent: "space-between",
    width: "100%",
  },
  playButton: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: "center",
    gap: 8,
  },
  playText: {
    fontSize: 18,
    letterSpacing: 0.5,
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
