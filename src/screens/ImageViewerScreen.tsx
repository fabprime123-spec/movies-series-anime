import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, StatusBar, ToastAndroid, Platform, Alert, Animated } from 'react-native'
import { X, Download, Info, Image, Smartphone, Monitor } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTheme } from '../theme/ThemeContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ImageViewer from 'react-native-image-zoom-viewer'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { Container } from '../components/ui/Container'
import { Text } from '../components/ui/Text'
import { NativeGradient } from '../components/native/NativeGradient'

const ORIGINAL_IMAGE_URL = 'https://image.tmdb.org/t/p/original'

export function ImageViewerScreen() {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { image, images, initialIndex } = route.params

  const [overlayVisible, setOverlayVisible] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0)
  const fadeAnim = React.useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: overlayVisible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [overlayVisible])

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible)
  }

  const downloadImage = async () => {
    try {
      const activeImage = images ? images[currentIndex] : image
      const url = `${ORIGINAL_IMAGE_URL}${activeImage.file_path}`
      const filename = activeImage.file_path.replace('/', '')

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

  const imageUrls = images
    ? images.map((img: any) => ({ url: `${ORIGINAL_IMAGE_URL}${img.file_path}` }))
    : [{ url: `${ORIGINAL_IMAGE_URL}${image.file_path}` }]

  const activeImage = images ? images[currentIndex] : image

  return (
    <Container useSafeArea={false} style={[styles.container, { backgroundColor: '#000000' }]}>
      <StatusBar hidden={!overlayVisible} showHideTransition={"slide"} />

      {/* Header Actions */}
      <Animated.View style={[styles.header, { top: Math.max(insets.top, 20), opacity: fadeAnim }]} pointerEvents={overlayVisible ? "auto" : "none"}>
        <NativeGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, { top: -60, height: 140, width: '150%', left: -20 }]}
          pointerEvents="none"
        />
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
          onPress={() => navigation.goBack()}
        >
          <X color="#FFF" size={28} />
        </TouchableOpacity>
      </Animated.View>

      <ImageViewer
        imageUrls={imageUrls}
        index={initialIndex || 0}
        onChange={(index) => setCurrentIndex(index || 0)}
        backgroundColor={"#000000"}
        renderIndicator={() => <View />} // Hide indicator
        enableSwipeDown={true}
        onSwipeDown={() => navigation.goBack()}
        enablePreload={true}
        pageAnimateTime={250}
        useNativeDriver={true}
        maxOverflow={150}
        onClick={toggleOverlay}
        style={{ backgroundColor: '#000000' }}
      />

      {/* Bottom Overlay Actions & Info */}
      <Animated.View style={[styles.bottomOverlay, { paddingBottom: Math.max(insets.bottom, 30), opacity: fadeAnim }]} pointerEvents={overlayVisible ? "auto" : "none"}>
        <NativeGradient
          colors={["transparent", theme.background + "77", theme.background + "aa", theme.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill]}
          pointerEvents="none"
        />

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Info size={16} color="#bbb" />
            <Text style={{ color: "#bbb", fontSize: 14, marginLeft: 8 }}>
              {images ? `Image ${activeImage.id} of ${images.length}` : 'Original Resolution'}
            </Text>
          </View>
          <Text weight="bold" style={{ color: "#FFF", fontSize: 24, marginTop: 4 }}>
            <Image color={theme.foreground} strokeWidth={1.5} />{"  "}
            {activeImage.width} × {activeImage.height}
          </Text>
          {activeImage.aspect_ratio && (
            <Text style={{ color: "#bbb", fontSize: 14, marginTop: 4 }}>Aspect Ratio: {activeImage.aspect_ratio.toFixed(2)}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.downloadBtn} onPress={downloadImage}>
          <Download color="#FFF" size={20} />
          <Text weight="semibold" style={{ color: "#FFF", marginLeft: 8 }}>Download</Text>
        </TouchableOpacity>
      </Animated.View>
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
  iconButton: {
    padding: 8,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 40,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  infoContainer: {
    flex: 1,
    gap: 6,
    pointerEvents: "none"
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 100,
    marginLeft: 16,
  }
})
