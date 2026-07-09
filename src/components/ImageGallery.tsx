import React from 'react'
import { View, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import { Text } from './ui/Text'
import { useTheme } from '../theme/ThemeContext'
import LinearGradient from 'react-native-linear-gradient'

interface ImageGalleryProps {
  images: any
}

const { width } = Dimensions.get('window')
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export function ImageGallery({ images }: ImageGalleryProps) {
  const { theme } = useTheme()

  if (!images || (!images.backdrops?.length && !images.posters?.length && !images.logos?.length)) {
    return null
  }

  const renderBackdrop = ({ item }: { item: any }) => (
    <TouchableOpacity>
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${item.file_path}` }}
        style={[styles.backdrop, { backgroundColor: theme.card }]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  )

  const renderPoster = ({ item }: { item: any }) => (
    <TouchableOpacity>
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${item.file_path}` }}
        style={[styles.poster, { backgroundColor: theme.card }]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {images.backdrops && images.backdrops.length > 0 && (
        <View style={styles.section}>
          <Text weight="bold" size={20} style={styles.title}>Backdrops & Posters</Text>
          <FlatList
            data={images.backdrops}
            keyExtractor={(item) => item.file_path}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderBackdrop}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}

      {images.posters && images.posters.length > 0 && (
        <View style={styles.section}>
          <FlatList
            data={images.posters}
            keyExtractor={(item) => item.file_path}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderPoster}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}

      <LinearGradient
        colors={[theme.background, "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  section: {
    marginBottom: 12,
  },
  title: {
    marginLeft: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  backdrop: {
    width: width * 0.75,
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },
  poster: {
    width: 140,
    aspectRatio: 2 / 3,
    borderRadius: 12,
  },
  button: {
    height: "auto",
    width: "auto"
  }
})
