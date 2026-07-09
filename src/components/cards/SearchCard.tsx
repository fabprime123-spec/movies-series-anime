import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TMDBMedia } from '../../types/tmdb'

interface MediaCardProps {
  media: TMDBMedia
  onPress?: () => void
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200'

export const SearchCard = React.memo(function SearchCard({ media, onPress }: MediaCardProps) {
  const navigation = useNavigation<any>()
  const imageUrl = media.poster_path ? `${IMAGE_BASE_URL}${media.poster_path}` : null

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('Details', { id: media.id, type: media.media_type || (media.title ? 'movie' : 'tv') });
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={styles.cardContainer}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.poster} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder} />
      )}
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    maxWidth: 106.2,
    borderRadius: 12,
    aspectRatio: 2 / 3,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a', // Placeholder background color
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3a3a3a',
  }
})
