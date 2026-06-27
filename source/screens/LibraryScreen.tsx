import { ActivityIndicator, Dimensions, FlatList, Image, Pressable, StyleSheet, TouchableOpacity, View } from "react-native"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { useState, useMemo } from "react"
import { useMediaStore, DownloadItem } from "../store/media.store"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { Bolt, Download, Film, Play, Settings, Star, Trash, User } from "lucide-react-native"
import { useNavigation, StackActions } from "@react-navigation/native"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CARD_WIDTH = (SCREEN_WIDTH - 40) / 3 // Spacing: 3 columns with margins



type ActiveTab = "watchlist" | "downloads" | "favorites"

export function LibraryScreen() {
  const navigation = useNavigation<any>()
  const { theme, mode, accentColor, blurTarget } = useTheme()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<ActiveTab>("watchlist")
  const { watchlist, favorites, downloads, removeDownload } = useMediaStore()

  // Map the user's watchlist from store, and mock progress percentages
  const watchlistItems = useMemo(() => {
    return watchlist.map((item, idx) => ({
      ...item,
      progress: [0.35, 0.72, 0.15, 0.90, 0.45, 0.60, 0.80, 0.50, 0.30, 0.75, 0.40, 0.85][idx % 12]
    }))
  }, [watchlist])

  const favoriteItems = favorites

  const handleDeleteDownload = (id: number) => {
    removeDownload(id)
  }

  const handleCardPress = (id: number, type: "movie" | "series") => {
    navigation.dispatch(StackActions.push("Details", { id, type }))
  }

  const tabs = [
    { id: "watchlist", label: "Watchlist" },
    { id: "downloads", label: "Downloads" },
    { id: "favorites", label: "Favorites" }
  ] as const

  const renderWatchlistItem = ({ item }: { item: typeof watchlistItems[0] }) => (
    <Pressable style={styles.gridCard} onPress={() => handleCardPress(item.id, item.type)}>
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster}` }}
          style={styles.gridPoster}
        />
        <View style={styles.playOverlay}>
          <View style={[styles.playBubble, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
            <Play size={14} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 2 }} />
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${item.progress * 100}%`, backgroundColor: accentColor }]} />
        </View>
      </View>
      <Text numberOfLines={1} style={[styles.cardTitle, { color: theme.foreground }]}>
        {item.title}
      </Text>
      <View style={styles.cardSubtitleRow}>
        <Text style={[styles.cardProgressText, { color: theme.muted }]}>
          {Math.round(item.progress * 100)}% watched
        </Text>
        <Text style={[styles.cardRating, { color: "#FFD700" }]}>
          ★ {item.rating.toFixed(1)}
        </Text>
      </View>
    </Pressable>
  )

  const renderFavoriteItem = ({ item }: { item: typeof favoriteItems[0] }) => (
    <Pressable style={styles.gridCard} onPress={() => handleCardPress(item.id, item.type)}>
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster}` }}
          style={styles.gridPoster}
        />
        <View style={styles.ratingBadge}>
          <Star size={10} color="#FFD700" fill="#FFD700" style={{ marginRight: 2 }} />
          <Text style={styles.ratingBadgeText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
      <Text numberOfLines={1} style={[styles.cardTitle, { color: theme.foreground }]}>
        {item.title}
      </Text>
      <Text style={[styles.cardType, { color: theme.muted }]}>
        {item.type === "movie" ? "Movie" : "Series"}
      </Text>
    </Pressable>
  )

  const renderDownloadItem = ({ item }: { item: DownloadItem }) => (
    <View style={[styles.downloadRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster}` }}
        style={styles.downloadPoster}
      />
      <View style={styles.downloadDetails}>
        <Text numberOfLines={1} style={[styles.downloadTitle, { color: theme.foreground }]}>
          {item.title}
        </Text>
        <Text style={[styles.downloadMeta, { color: theme.muted }]}>
          {item.type === "movie" ? "Movie" : "Series"} • {item.duration || ""}
        </Text>
        <View style={styles.downloadStatusRow}>
          <View style={[styles.statusIndicator, { backgroundColor: item.status === "completed" ? "#10B981" : accentColor }]} />
          <Text style={[styles.downloadSize, { color: theme.muted }]}>
            {item.status === "completed" ? `Downloaded (${item.size})` : `Downloading... ${Math.round(item.progress * 100)}%`}
          </Text>
        </View>
      </View>
      <View style={styles.downloadActions}>
        {item.status === "completed" ? (
          <TouchableOpacity
            style={[styles.playButtonCircular, { backgroundColor: accentColor }]}
            onPress={() => handleCardPress(item.id, item.type)}
            activeOpacity={0.8}
          >
            <Play size={12} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 1 }} />
          </TouchableOpacity>
        ) : (
          <View style={styles.downloadProgressIndicator}>
            <Text style={{ fontSize: 10, color: accentColor, fontWeight: "bold" }}>{Math.round(item.progress * 100)}%</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: "rgba(239, 68, 68, 0.12)" }]}
          onPress={() => handleDeleteDownload(item.id)}
          activeOpacity={0.7}
        >
          <Trash size={15} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderActiveContent = () => {
    if (activeTab === "watchlist") {
      if (watchlistItems.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.card }]}>
              <Film size={32} color={theme.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.foreground }]}>Your Watchlist is Empty</Text>
            <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
              Tap the 'Plus' button on any movie details page to save it to your watchlist.
            </Text>
          </View>
        )
      }
      return (
        <FlatList
          data={watchlistItems}
          renderItem={renderWatchlistItem}
          keyExtractor={(item) => `watchlist-${item.type}-${item.id}`}
          numColumns={3}
          columnWrapperStyle={styles.gridRowWrapper}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )
    }

    if (activeTab === "favorites") {
      if (favoriteItems.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.card }]}>
              <Star size={32} color={theme.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.foreground }]}>No Favorites Yet</Text>
            <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
              Tap the 'Heart' icon on any movie details page to show some love!
            </Text>
          </View>
        )
      }
      return (
        <FlatList
          data={favoriteItems}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => `fav-${item.type}-${item.id}`}
          numColumns={3}
          columnWrapperStyle={styles.gridRowWrapper}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )
    }

    // Downloads
    if (downloads.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: theme.card }]}>
            <Download size={32} color={theme.muted} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.foreground }]}>No Downloads Yet</Text>
          <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
            Movies and Series you download will appear here for offline viewing.
          </Text>
        </View>
      )
    }

    return (
      <FlatList
        data={downloads}
        renderItem={renderDownloadItem}
        keyExtractor={(item) => `download-${item.id}`}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    )
  }

  return (
    <Container>
      <View style={styles.headerContainer}>
        {blurTarget?.current ? (
          <BlurView
            intensity={mode === "dark" ? 50 : 75}
            tint={mode === "dark" ? "dark" : "light"}
            blurMethod="dimezisBlurView"
            blurTarget={blurTarget}
            style={[StyleSheet.absoluteFill, { backgroundColor: mode === "dark" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)" }]}
          />
        ) : (
          <LinearGradient
            colors={[theme.background, theme.background + "dd", theme.background + "bb", theme.background + "88", theme.background + "66", "transparent"]}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={styles.headerContentWrapper}>
          <View style={styles.headerLeft}>
            <Film size={22} color={accentColor} />
            <Text style={[styles.headerTitle, { color: theme.foreground }]}>My Space</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: theme.card, marginRight: 8 }]}
              activeOpacity={0.7}
            >
              <Bolt size={18} color={theme.foreground} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: theme.card, overflow: "hidden" }]}
              onPress={() => navigation.navigate("Profile" as any)}
              activeOpacity={0.7}
            >
              {user?.photo ? (
                <Image source={{ uri: user.photo }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />
              ) : (
                <User size={18} color={theme.foreground} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={[{ key: "content" }]}
        renderItem={() => (
          <View>
            {/* Segmented capsule control */}
            <View style={styles.segmentedControlContainer}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[
                      styles.segmentButton,
                      isActive
                        ? { backgroundColor: accentColor }
                        : { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }
                    ]}
                    onPress={() => setActiveTab(tab.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        isActive
                          ? { color: "#FFFFFF", fontFamily: "GeneralSans-Bold" }
                          : { color: theme.muted, fontFamily: "GeneralSans-Medium" }
                      ]}
                    >
                      {tab.label}
                      {tab.id === "downloads" && downloads.length > 0 && ` (${downloads.length})`}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {renderActiveContent()}
          </View>
        )}
        keyExtractor={(item) => item.key}
        contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 10,
    overflow: "hidden",
  },
  headerContentWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "ClashGrotesk-Bold",
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 64,
    paddingBottom: 110,
    minHeight: "100%",
  },
  segmentedControlContainer: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 14,
    paddingHorizontal: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentText: {
    fontSize: 13,
  },
  gridRowWrapper: {
    justifyContent: "flex-start",
  },
  gridCard: {
    width: CARD_WIDTH,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  posterContainer: {
    width: "100%",
    height: CARD_WIDTH * 1.5,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    position: "relative",
  },
  gridPoster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  playBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  progressBar: {
    height: "100%",
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: "GeneralSans-Semibold",
    marginTop: 6,
    paddingHorizontal: 2,
  },
  cardSubtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    paddingHorizontal: 2,
  },
  cardProgressText: {
    fontSize: 10,
    fontFamily: "GeneralSans-Medium",
  },
  cardRating: {
    fontSize: 10,
    fontFamily: "GeneralSans-Semibold",
  },
  cardType: {
    fontSize: 10,
    fontFamily: "GeneralSans-Medium",
    marginTop: 1,
    paddingHorizontal: 2,
  },
  ratingBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "GeneralSans-Bold",
  },
  downloadRow: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  downloadPoster: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    resizeMode: "cover",
  },
  downloadDetails: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  downloadTitle: {
    fontSize: 14,
    fontFamily: "GeneralSans-Bold",
  },
  downloadMeta: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
  },
  downloadStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  downloadSize: {
    fontSize: 11,
    fontFamily: "GeneralSans-Medium",
  },
  downloadActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playButtonCircular: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadProgressIndicator: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: "GeneralSans-Bold",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: "GeneralSans-Medium",
    textAlign: "center",
    lineHeight: 18,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  }
})