import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, StatusBar, ToastAndroid, Platform, Alert } from 'react-native'
import { X, Download, Palette } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTheme } from '../theme/ThemeContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ImageViewer from 'react-native-image-zoom-viewer'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { Container } from '../components/ui/Container'

const ORIGINAL_IMAGE_URL = 'https://image.tmdb.org/t/p/original'

export function ImageViewerScreen() {
  const { theme, changeMode } = useTheme()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { image } = route.params

  const downloadImage = async () => {
    try {
      const url = `${ORIGINAL_IMAGE_URL}${image.file_path}`
      const filename = image.file_path.replace('/', '')

      const { dirs } = ReactNativeBlobUtil.fs
      // Use PictureDir for Android
      const dirToSave = Platform.OS === 'android' ? dirs.PictureDir : dirs.DocumentDir
      const dest = `${dirToSave}/${filename}`

      if (Platform.OS === 'android') {
        ToastAndroid.show('Downloading...', ToastAndroid.SHORT)
      }

      const res = await ReactNativeBlobUtil.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: dest,
          description: 'Image',
          mediaScannable: true
        }
      }).fetch('GET', url)

      if (Platform.OS === 'android') {
        ToastAndroid.show('Image saved successfully!', ToastAndroid.LONG)
      } else {
        Alert.alert("Success", "Image saved successfully.")
      }
    } catch (err) {
      console.error(err)
      Alert.alert("Error", "Failed to download image.")
    }
  }

  const imageUrls = [{ url: `${ORIGINAL_IMAGE_URL}${image.file_path}` }]

  return (
    <Container useSafeArea={false} style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar hidden showHideTransition={"slide"} />

      {/* Header Actions */}
      <View style={[styles.header, { top: Math.max(insets.top, 20) }]}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.ring + "33" }]}
          onPress={() => navigation.goBack()}
        >
          <X color={theme.foreground} size={28} />
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.ring + "33" }]}
            onPress={() => changeMode()}
          >
            <Palette color={theme.foreground} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.ring + "33" }]}
            onPress={downloadImage}
          >
            <Download color={theme.foreground} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ImageViewer
        imageUrls={imageUrls}
        backgroundColor={"#ffffff00"}
        renderIndicator={() => <View />} // Hide indicator
        enableSwipeDown={true}
        onSwipeDown={() => navigation.goBack()}
        enablePreload
        style={{ backgroundColor: theme.background }}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
