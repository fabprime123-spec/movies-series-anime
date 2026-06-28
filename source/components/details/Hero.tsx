import React, { useRef } from "react"
import { Image, StyleSheet, View, TouchableOpacity, ActivityIndicator, PanResponder } from "react-native"
import { DetailsItem } from "../../types/details.type"
import { Text } from "../ui/Text"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "../../context/ThemeContext"
import { useMediaStore } from "../../store/media.store"
import { Play, Plus, Check, Heart, Download, CheckCircle } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

interface Props {
  data: DetailsItem
  onPlay?: () => void
}

export function Hero({ data, onPlay }: Props) {
  const { theme, accentColor } = useTheme()
  const navigation = useNavigation()

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Trigger responder only for downward swipes of sufficient distance/speed
        return gestureState.dy > 30 && Math.abs(gestureState.dx) < 20
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50 && gestureState.vy > 0.2) {
          navigation.goBack()
        }
      }
    })
  ).current

  const {
    watchlist,
    favorites,
    downloads,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    startDownloadSimulation
  } = useMediaStore()

  const inWatchlist = watchlist.some(i => i.id === data.id && i.type === data.type)
  const isFav = favorites.some(i => i.id === data.id && i.type === data.type)
  const downloadItem = downloads.find(d => d.id === data.id)

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(data.id, data.type)
    } else {
      addToWatchlist({
        id: data.id,
        title: data.title,
        poster: data.poster,
        backdrop: data.backdrop,
        rating: data.rating,
        release_date: data.releaseDate,
        type: data.type
      })
    }
  }

  const handleFavoriteToggle = () => {
    if (isFav) {
      removeFromFavorites(data.id, data.type)
    } else {
      addToFavorites({
        id: data.id,
        title: data.title,
        poster: data.poster,
        backdrop: data.backdrop,
        rating: data.rating,
        release_date: data.releaseDate,
        type: data.type
      })
    }
  }

  const handleDownloadClick = () => {
    if (downloadItem) return
    startDownloadSimulation({
      id: data.id,
      title: data.title,
      poster: data.poster,
      size: data.type === "movie" ? "1.6 GB" : "920 MB",
      type: data.type,
      duration: data.type === "movie" ? `${data.runtime || 120} min` : "S1 E1"
    })
  }

  return (
    <View>
      <View {...panResponder.panHandlers} style={{ position: "relative" }}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/original${data.backdrop}` }}
          style={styles.backdrop}
        />
        <LinearGradient colors={["#ffffff00", "#ffffff00", theme.background]} style={styles.gradient} />
      </View>

      <View style={styles.overlay}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/original${data.poster}` }}
          style={styles.poster}
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {data.title}
          </Text>

          <Text style={[styles.meta, { color: theme.foreground }]}>
            ★ {data.rating.toFixed(1)}  •  {data.releaseDate.slice(0, 4)}
          </Text>

          <Text numberOfLines={1} style={[styles.genre, { color: theme.muted }]}>
            {data.genres.slice(0, 3).join(" • ")}
          </Text>

          <View style={styles.buttonRow}>
            {/* Play Button */}
            <TouchableOpacity
              style={[styles.playBtn, { backgroundColor: accentColor }]}
              onPress={onPlay}
              activeOpacity={0.8}
            >
              <Play size={14} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.playBtnText}>Watch</Text>
            </TouchableOpacity>

            {/* Watchlist Button */}
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={handleWatchlistToggle}
              activeOpacity={0.7}
            >
              {inWatchlist ? (
                <Check size={16} color={accentColor} strokeWidth={2.5} />
              ) : (
                <Plus size={16} color={theme.foreground} />
              )}
            </TouchableOpacity>

            {/* Favorite Button */}
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={handleFavoriteToggle}
              activeOpacity={0.7}
            >
              <Heart
                size={16}
                color={isFav ? "#EF4444" : theme.foreground}
                fill={isFav ? "#EF4444" : "transparent"}
              />
            </TouchableOpacity>

            {/* Download Button */}
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={handleDownloadClick}
              disabled={!!downloadItem}
              activeOpacity={0.7}
            >
              {downloadItem?.status === "completed" ? (
                <CheckCircle size={16} color="#10B981" />
              ) : downloadItem?.status === "downloading" ? (
                <ActivityIndicator size="small" color={accentColor} />
              ) : (
                <Download size={16} color={theme.foreground} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    width: "100%",
    height: "auto",
    aspectRatio: 16 / 9,
    resizeMode: "contain",
  },
  gradient: {
    position: "absolute",
    aspectRatio: 16 / 9,
    width: "100%",
  },
  overlay: {
    flexDirection: "row",
    marginTop: -80,
    paddingHorizontal: 16,
    alignItems: "flex-end",
  },
  poster: {
    width: 110,
    height: 165,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "flex-end",
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: "GeneralSans-Bold",
  },
  meta: {
    fontSize: 13,
    fontFamily: "GeneralSans-Medium",
    marginTop: 2,
  },
  genre: {
    fontSize: 11,
    fontFamily: "GeneralSans-Medium",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    alignItems: "center",
  },
  playBtn: {
    flex: 1,
    flexDirection: "row",
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "GeneralSans-Bold",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  }
})