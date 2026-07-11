import React, { useState, useRef } from 'react'
import { View, Image, StyleSheet, FlatList, TouchableOpacity, Modal, useWindowDimensions, StatusBar } from 'react-native'
import { X } from 'lucide-react-native'
import { Text } from '../ui/Text'
import { useTheme } from '../../theme/ThemeContext'
import { useNavigation } from '@react-navigation/native'

interface ImageGalleryProps {
  images: any
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const ORIGINAL_IMAGE_URL = 'https://image.tmdb.org/t/p/original'

export function ImageGallery({ images }: ImageGalleryProps) {
  const { theme } = useTheme()
  const { width } = useWindowDimensions()
  const navigation = useNavigation<any>()

  if (!images || (!images.backdrops?.length && !images.posters?.length && !images.logos?.length)) {
    return null
  }

  // Combine backdrops and posters for the carousel
  const allImages = [...(images.backdrops || []), ...(images.posters || [])]

  const openGallery = (imagePath: string) => {
    const index = allImages.findIndex(img => img.file_path === imagePath)
    if (index !== -1) {
      navigation.navigate('VerticalImage', { images: allImages, selectedIndex: index })
    }
  }

  const renderBackdrop = ({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => openGallery(item.file_path)}>
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${item.file_path}` }}
        style={[styles.backdrop, { backgroundColor: theme.card, width: width * 0.75 }]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  )

  const renderPoster = ({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => openGallery(item.file_path)}>
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
    paddingHorizontal: 14,
    gap: 12,
  },
  backdrop: {
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },
  poster: {
    width: 140,
    aspectRatio: 2 / 3,
    borderRadius: 12,
  }
})
