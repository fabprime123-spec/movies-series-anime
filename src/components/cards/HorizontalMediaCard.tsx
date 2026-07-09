import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Text } from '../ui/Text'
import { TMDBMedia } from '../../types/tmdb'
import { useTheme } from '../../theme/ThemeContext'
import { Star } from 'lucide-react-native'

interface HorizontalMediaCardProps {
  media: TMDBMedia
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'

export const HorizontalMediaCard = React.memo(function HorizontalMediaCard({ media }: HorizontalMediaCardProps) {
  const { theme } = useTheme()
  const navigation = useNavigation<any>() // any for now, could use NativeStackNavigationProp

  const imageUrl = media.backdrop_path ? `${IMAGE_BASE_URL}${media.backdrop_path}` :
    media.poster_path ? `${IMAGE_BASE_URL}${media.poster_path}` : null
  const title = media.title || media.name || media.original_title || media.original_name

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Details', { id: media.id, type: media.media_type || (media.title ? 'movie' : 'tv') })}
      style={[styles.cardContainer, { backgroundColor: theme.card }]}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder} />
      )}
      <View style={styles.info}>
        <Text weight="bold" size={14} numberOfLines={1} style={styles.title}>{title}</Text>
        {media.vote_average ? (
          <View style={styles.ratingRow}>
            <Star size={12} color="#f5c518" fill="#f5c518" />
            <Text size={12} color={theme.muted}>{media.vote_average.toFixed(1)}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  cardContainer: {
    width: 240,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  placeholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#3a3a3a',
  },
  info: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6
  },
  title: {
    maxWidth: "85.5%"
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    gap: 4,
  }
})
