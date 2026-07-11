import React, { useRef, useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions, StatusBar } from 'react-native'
import FastImage from 'react-native-fast-image'
import { X } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTheme } from '../theme/ThemeContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ORIGINAL_IMAGE_URL = 'https://image.tmdb.org/t/p/original'

export function VerticalImageScreen() {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { width, height } = useWindowDimensions()
  const { images, selectedIndex } = route.params
  const [horizontal, setHorizontal] = useState<boolean>(false)

  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    // Scroll to the selected image immediately on mount
    if (flatListRef.current && selectedIndex > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: selectedIndex, animated: false })
      }, 100)
    }
  }, [selectedIndex])

  const renderCarouselItem = ({ item }: { item: any }) => {
    const isBackdrop = item.aspect_ratio > 1
    return (
      <TouchableOpacity
        activeOpacity={0.98}
        style={[styles.carouselItem, { width }]}
        onPress={() => navigation.navigate('ImageViewer', { image: item })}
      >
        <FastImage
          source={{ 
            uri: `${ORIGINAL_IMAGE_URL}${item.file_path}`,
            priority: FastImage.priority.high,
          }}
          style={{ width: '100%', height: width / item.aspect_ratio }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar hidden showHideTransition={"slide"} />
      <TouchableOpacity
        style={[styles.closeButton, { top: Math.max(insets.top, 20), backgroundColor: theme.foreground + "33" }]}
        onPress={() => navigation.goBack()}
      >
        <X color={theme.background} size={28} />
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(item) => item.file_path}
        horizontal={horizontal}
        showsVerticalScrollIndicator={true}
        renderItem={renderCarouselItem}
        initialScrollIndex={selectedIndex}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(() => resolve(true), 500))
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: false })
          })
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 40,
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
