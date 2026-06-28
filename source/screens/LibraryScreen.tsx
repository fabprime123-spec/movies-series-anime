import React, { useState, useMemo } from "react"
import { Image, FlatList, StyleSheet, TouchableOpacity, View, Pressable, TextInput, Platform, ScrollView } from "react-native"
import { useMediaStore, DownloadItem } from "../store/media.store"
import { StackActions, useNavigation } from "@react-navigation/native"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Bolt, Download, Film, Play, Star, Trash, User, X, Search, SlidersHorizontal, Bookmark } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

type ActiveTab = "watchlist" | "downloads" | "favorites" | "history"

export function LibraryScreen() {
  const navigation = useNavigation<any>()
  const { theme, mode, accentColor, blurTarget } = useTheme()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<ActiveTab>("watchlist")
  const { watchlist, favorites, downloads, removeDownload } = useMediaStore()

  // Search & Sorting States
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "rating">("title")

  // Advanced Filters
  const [filterLanguage, setFilterLanguage] = useState<string>("all")
  const [filterCountry, setFilterCountry] = useState<string>("all")
  const [filterYear, setFilterYear] = useState<string>("all")
  const [filterPlatform, setFilterPlatform] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false)

  // Map the user's watchlist from store, and mock progress percentages
  const watchlistItems = useMemo(() => {
    return watchlist.map((item, idx) => ({
      ...item,
      progress: [0.35, 0.72, 0.15, 0.90, 0.45, 0.60, 0.80, 0.50, 0.30, 0.75, 0.40, 0.85][idx % 12]
    }))
  }, [watchlist])

  const favoriteItems = favorites

  // Pre-process items to ensure consistent fields for filtering
  const processLibraryItems = (list: any[]) => {
    return list.map((item, idx) => {
      const rawYear = (item.release_date || item.first_air_date || "").split("-")[0]
      const year = rawYear || ["2026", "2025", "2024", "2023", "2022", "2021", "2020"][idx % 7]
      const lang = item.original_language || ["en", "hi", "ko", "ja", "es", "fr"][idx % 6]

      // Deduce country
      let country = "US"
      if (lang === "hi") country = "IN"
      else if (lang === "ko") country = "KR"
      else if (lang === "ja") country = "JP"
      else if (lang === "es") country = "ES"
      else if (lang === "fr") country = "FR"
      else if (idx % 5 === 0) country = "GB"

      // Deduce platform
      const platform = item.platform || ["netflix", "disney", "prime", "apple"][idx % 4]

      return {
        ...item,
        year,
        lang,
        country,
        platform,
        progress: item.progress || [0.35, 0.72, 0.15, 0.90, 0.45, 0.60, 0.80, 0.50, 0.30, 0.75, 0.40, 0.85][idx % 12]
      }
    })
  }

  const processedWatchlist = useMemo(() => processLibraryItems(watchlistItems), [watchlistItems])
  const processedFavorites = useMemo(() => processLibraryItems(favoriteItems), [favoriteItems])
  const processedDownloads = useMemo(() => processLibraryItems(downloads), [downloads])

  const handleDeleteDownload = (id: number) => {
    removeDownload(id)
  }

  const handleCardPress = (id: number, type: "movie" | "series") => {
    navigation.dispatch(StackActions.push("Details", { id, type }))
  }

  // Filter and Sort Helper
  const filterAndSort = (list: any[]) => {
    let result = [...list]
    // Text search filter
    if (searchQuery.trim().length > 0) {
      result = result.filter(item =>
        (item.title || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    // Type filter
    if (filterType !== "all") {
      result = result.filter(item => item.type === filterType)
    }
    // Platform filter
    if (filterPlatform !== "all") {
      result = result.filter(item => item.platform === filterPlatform)
    }
    // Language filter
    if (filterLanguage !== "all") {
      result = result.filter(item => item.lang === filterLanguage)
    }
    // Country filter
    if (filterCountry !== "all") {
      result = result.filter(item => item.country === filterCountry)
    }
    // Year filter
    if (filterYear !== "all") {
      result = result.filter(item => item.year === filterYear)
    }
    // Sort
    if (sortBy === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }
    return result
  }

  const historyItems = useMemo(() => [
    {
      id: 278,
      title: "The Shawshank Redemption",
      poster: "/9cqN025Ftw7wUl4kIYPRIGgzH7N.jpg",
      type: "movie",
      rating: 10,
      completedDate: "Yesterday",
      lang: "en",
      country: "US",
      platform: "netflix",
      year: "1994"
    },
    {
      id: 49051,
      title: "The Hobbit: An Unexpected Journey",
      poster: "/y95lQLpp2j4F34xI5xsa6Gz15ay.jpg",
      type: "movie",
      rating: 8.5,
      completedDate: "3 days ago",
      lang: "en",
      country: "US",
      platform: "prime",
      year: "2012"
    },
    {
      id: 1396,
      title: "Breaking Bad",
      poster: "/9fa5tG2c27V1Q2O1hG8jT10b904.jpg",
      type: "series",
      rating: 9.8,
      completedDate: "Last week",
      lang: "en",
      country: "US",
      platform: "netflix",
      year: "2013"
    }
  ], [])

  const filteredWatchlist = useMemo(() => filterAndSort(processedWatchlist), [processedWatchlist, searchQuery, sortBy, filterType, filterPlatform, filterLanguage, filterCountry, filterYear])
  const filteredFavorites = useMemo(() => filterAndSort(processedFavorites), [processedFavorites, searchQuery, sortBy, filterType, filterPlatform, filterLanguage, filterCountry, filterYear])
  const filteredDownloads = useMemo(() => filterAndSort(processedDownloads), [processedDownloads, searchQuery, sortBy, filterType, filterPlatform, filterLanguage, filterCountry, filterYear])
  const filteredHistory = useMemo(() => filterAndSort(historyItems), [historyItems, searchQuery, sortBy, filterType, filterPlatform, filterLanguage, filterCountry, filterYear])

  const tabs = [
    { id: "watchlist", label: "Watchlist" },
    { id: "downloads", label: "Downloads" },
    { id: "favorites", label: "Favorites" },
    { id: "history", label: "History" }
  ] as const

  const renderWatchlistItem = ({ item }: { item: typeof watchlistItems[0] }) => {
    const rating = typeof item.rating === "number" ? item.rating : 0
    const progress = typeof item.progress === "number" ? item.progress : 0
    const title = item.title || "Untitled"
    const posterUrl = item.poster ? `https://image.tmdb.org/t/p/w300${item.poster}` : ""

    return (
      <Pressable style={styles.gridCard} onPress={() => handleCardPress(item.id, item.type)}>
        <View style={styles.posterContainer}>
          {posterUrl ? (
            <Image source={{ uri: posterUrl }} style={styles.gridPoster} />
          ) : (
            <View style={[styles.gridPoster, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
              <Film size={22} color={theme.muted} />
            </View>
          )}
          <View style={styles.playOverlay}>
            <View style={[styles.playBubble, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
              <Play size={14} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 2 }} />
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: accentColor }]} />
          </View>
        </View>
        <Text numberOfLines={1} style={[styles.cardTitle, { color: theme.foreground }]}>
          {title}
        </Text>
        <View style={styles.cardSubtitleRow}>
          <Text style={[styles.cardProgressText, { color: theme.muted }]}>
            {Math.round(progress * 100)}% watched
          </Text>
          <Text style={[styles.cardRating, { color: "#FFD700" }]}>
            ★ {rating.toFixed(1)}
          </Text>
        </View>
      </Pressable>
    )
  }

  const renderFavoriteItem = ({ item }: { item: typeof favoriteItems[0] }) => {
    const rating = typeof item.rating === "number" ? item.rating : 0
    const title = item.title || "Untitled"
    const type = item.type || "movie"
    const posterUrl = item.poster ? `https://image.tmdb.org/t/p/w300${item.poster}` : ""

    return (
      <Pressable style={styles.gridCard} onPress={() => handleCardPress(item.id, item.type)}>
        <View style={styles.posterContainer}>
          {posterUrl ? (
            <Image source={{ uri: posterUrl }} style={styles.gridPoster} />
          ) : (
            <View style={[styles.gridPoster, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
              <Film size={22} color={theme.muted} />
            </View>
          )}
          <View style={styles.ratingBadge}>
            <Star size={10} color="#FFD700" fill="#FFD700" style={{ marginRight: 2 }} />
            <Text style={styles.ratingBadgeText}>{rating.toFixed(1)}</Text>
          </View>
        </View>
        <Text numberOfLines={1} style={[styles.cardTitle, { color: theme.foreground }]}>
          {title}
        </Text>
        <Text style={[styles.cardType, { color: theme.muted }]}>
          {type === "movie" ? "Movie" : "Series"}
        </Text>
      </Pressable>
    )
  }

  const renderHistoryItem = ({ item }: { item: any }) => {
    const title = item.title || "Untitled"
    const rating = typeof item.rating === "number" ? item.rating : 0
    const posterUrl = item.poster ? `https://image.tmdb.org/t/p/w300${item.poster}` : ""

    return (
      <Pressable style={styles.gridCard} onPress={() => handleCardPress(item.id, item.type)}>
        <View style={styles.posterContainer}>
          {posterUrl ? (
            <Image source={{ uri: posterUrl }} style={styles.gridPoster} />
          ) : (
            <View style={[styles.gridPoster, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
              <Film size={22} color={theme.muted} />
            </View>
          )}
          <View style={styles.ratingBadge}>
            <Star size={10} color="#FFD700" fill="#FFD700" style={{ marginRight: 2 }} />
            <Text style={styles.ratingBadgeText}>{rating.toFixed(1)}</Text>
          </View>
        </View>
        <Text numberOfLines={1} style={[styles.cardTitle, { color: theme.foreground }]}>
          {title}
        </Text>
        <Text style={[styles.cardType, { color: theme.muted }]}>
          {item.completedDate}
        </Text>
      </Pressable>
    )
  }

  const renderDownloadItem = ({ item }: { item: DownloadItem }) => {
    const posterUrl = item.poster ? `https://image.tmdb.org/t/p/w200${item.poster}` : ""
    const progress = typeof item.progress === "number" ? item.progress : (item.status === "completed" ? 1.0 : 0)
    const status = item.status || "completed"
    const size = item.size || "0 MB"
    const title = item.title || "Untitled"
    const type = item.type || "movie"
    const duration = item.duration || ""

    return (
      <View style={[styles.downloadRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {item.poster ? (
          <Image source={{ uri: posterUrl }} style={styles.downloadPoster} />
        ) : (
          <View style={[styles.downloadPoster, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
            <Film size={20} color={theme.muted} />
          </View>
        )}
        <View style={styles.downloadDetails}>
          <Text numberOfLines={1} style={[styles.downloadTitle, { color: theme.foreground }]}>
            {title}
          </Text>
          <Text style={[styles.downloadMeta, { color: theme.muted }]}>
            {type === "movie" ? "Movie" : "Series"} {duration ? `• ${duration}` : ""}
          </Text>
          <View style={styles.downloadStatusRow}>
            <View style={[styles.statusIndicator, { backgroundColor: status === "completed" ? "#10B981" : accentColor }]} />
            <Text style={[styles.downloadSize, { color: theme.muted }]}>
              {status === "completed" ? `Downloaded (${size})` : `Downloading... ${Math.round(progress * 100)}%`}
            </Text>
          </View>
        </View>
        <View style={styles.downloadActions}>
          {status === "completed" ? (
            <TouchableOpacity
              style={[styles.playButtonCircular, { backgroundColor: accentColor }]}
              onPress={() => handleCardPress(item.id, type)}
              activeOpacity={0.8}
            >
              <Play size={12} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 1 }} />
            </TouchableOpacity>
          ) : (
            <View style={styles.downloadProgressIndicator}>
              <Text style={{ fontSize: 10, color: accentColor, fontWeight: "bold" }}>{Math.round(progress * 100)}%</Text>
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
  }

  const renderActiveContent = () => {
    if (activeTab === "watchlist") {
      if (filteredWatchlist.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.card }]}>
              <Film size={32} color={theme.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.foreground }]}>
              {searchQuery ? "No matches found" : "Your Watchlist is Empty"}
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
              {searchQuery ? "Try searching for another title" : "Tap the 'Plus' button on any movie details page to save it."}
            </Text>
          </View>
        )
      }
      return (
        <FlatList
          key={`list-${activeTab}`}
          data={filteredWatchlist}
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
      if (filteredFavorites.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.card }]}>
              <Star size={32} color={theme.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.foreground }]}>
              {searchQuery ? "No matches found" : "No Favorites Yet"}
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
              {searchQuery ? "Try searching for another title" : "Tap the 'Heart' icon on any details page to show some love!"}
            </Text>
          </View>
        )
      }
      return (
        <FlatList
          key={`list-${activeTab}`}
          data={filteredFavorites}
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
    if (activeTab === "downloads") {
      if (filteredDownloads.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.card }]}>
              <Download size={32} color={theme.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.foreground }]}>
              {searchQuery ? "No matches found" : "No Downloads Yet"}
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
              {searchQuery ? "Try searching for another title" : "Movies and Series you download will appear here for offline viewing."}
            </Text>
          </View>
        )
      }

      return (
        <FlatList
          key={`list-${activeTab}`}
          numColumns={1}
          data={filteredDownloads}
          renderItem={renderDownloadItem}
          keyExtractor={(item) => `download-${item.id}`}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )
    }

    // History
    if (filteredHistory.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: theme.card }]}>
            <Bookmark size={32} color={theme.muted} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.foreground }]}>
            {searchQuery ? "No matches found" : "No Completed Shows"}
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
            {searchQuery ? "Try searching for another title" : "Shows and movies you finish watching will appear here."}
          </Text>
        </View>
      )
    }

    return (
      <FlatList
        key={`list-${activeTab}`}
        numColumns={3}
        columnWrapperStyle={styles.gridRowWrapper}
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => `history-${item.id}`}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    )
  }

  const activeBlurMethod = (blurTarget && blurTarget.current) ? "dimezisBlurView" : "none"

  return (
    <Container>
      {/* Optimized Glassmorphic Blur Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[theme.background, `${theme.background}E6`, "transparent"]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.headerContentWrapper}>
          <View style={styles.headerLeft}>
            <Film size={22} color={accentColor} />
            <Text style={[styles.headerTitle, { color: theme.foreground }]}>My Space</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.headerBtn, { backgroundColor: theme.card, marginRight: 8 }]}
              onPress={() => navigation.navigate("Settings")}
              activeOpacity={0.7}
            >
              <SlidersHorizontal size={18} color={theme.foreground} />
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
            {/* Space Statistics Card */}
            <View style={[styles.statsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statsCardTitle, { color: theme.foreground }]}>Library Overview</Text>
              <View style={styles.statsMetricsRow}>
                <View style={styles.metricBox}>
                  <Text style={[styles.metricVal, { color: accentColor }]}>
                    {watchlist.length + favorites.length}
                  </Text>
                  <Text style={[styles.metricLabel, { color: theme.muted }]}>Saved Titles</Text>
                </View>
                <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
                <View style={styles.metricBox}>
                  <Text style={[styles.metricVal, { color: accentColor }]}>
                    {downloads.length}
                  </Text>
                  <Text style={[styles.metricLabel, { color: theme.muted }]}>Downloads</Text>
                </View>
                <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
                <View style={styles.metricBox}>
                  <Text style={[styles.metricVal, { color: accentColor }]}>
                    {downloads.length > 0 ? `${(downloads.length * 1.4).toFixed(1)} GB` : "0.0 GB"}
                  </Text>
                  <Text style={[styles.metricLabel, { color: theme.muted }]}>Disk Space</Text>
                </View>
              </View>
            </View>

            {/* Segmented capsule control */}
            <View style={styles.segmentedControlContainer}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                const count = tab.id === "downloads" ? downloads.length : tab.id === "watchlist" ? watchlist.length : tab.id === "favorites" ? favorites.length : historyItems.length
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[
                      styles.segmentButton,
                      isActive
                        ? { backgroundColor: accentColor }
                        : { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }
                    ]}
                    onPress={() => {
                      setActiveTab(tab.id)
                      setSearchQuery("")
                    }}
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
                      {count > 0 && ` (${count})`}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {/* Premium Search Filter and Sort Controls */}
            <View style={[styles.filterControls, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Search size={16} color={theme.muted} style={{ marginRight: 8 }} />
                <TextInput
                  placeholder={`Search ${activeTab}...`}
                  placeholderTextColor={theme.muted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={[styles.searchInput, { color: theme.foreground }]}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <X size={16} color={theme.muted} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.sortRow}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={[styles.sortLabel, { color: theme.muted }]}>Sort By:</Text>
                  <View style={styles.sortChips}>
                    {[
                      { id: "title", label: "A-Z" },
                      { id: "rating", label: "Rating" }
                    ].map((option) => {
                      const isSelected = sortBy === option.id
                      return (
                        <TouchableOpacity
                          key={option.id}
                          onPress={() => setSortBy(option.id as any)}
                          style={[
                            styles.sortChip,
                            {
                              backgroundColor: isSelected ? `${accentColor}1A` : theme.surface,
                              borderColor: isSelected ? accentColor : theme.border
                            }
                          ]}
                        >
                          <Text style={[styles.sortChipText, { color: isSelected ? accentColor : theme.foreground }]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </View>

                {/* Advanced Filters Toggle Button */}
                {(() => {
                  const activeFiltersCount =
                    (filterLanguage !== "all" ? 1 : 0) +
                    (filterCountry !== "all" ? 1 : 0) +
                    (filterYear !== "all" ? 1 : 0) +
                    (filterPlatform !== "all" ? 1 : 0) +
                    (filterType !== "all" ? 1 : 0)
                  return (
                    <TouchableOpacity
                      style={[
                        styles.advancedFilterBtn,
                        {
                          backgroundColor: showFilterPanel || activeFiltersCount > 0 ? `${accentColor}1A` : theme.surface,
                          borderColor: showFilterPanel || activeFiltersCount > 0 ? accentColor : theme.border,
                          borderWidth: 1,
                        }
                      ]}
                      onPress={() => setShowFilterPanel(!showFilterPanel)}
                      activeOpacity={0.8}
                    >
                      <SlidersHorizontal size={12} color={showFilterPanel || activeFiltersCount > 0 ? accentColor : theme.foreground} style={{ marginRight: 6 }} />
                      <Text style={[styles.advancedFilterBtnText, { color: showFilterPanel || activeFiltersCount > 0 ? accentColor : theme.foreground }]}>
                        Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
                      </Text>
                    </TouchableOpacity>
                  )
                })()}
              </View>

              {/* Advanced Filter Drawer Section */}
              {showFilterPanel && (
                <View style={[styles.filterDrawer, { borderTopWidth: 0.5, borderTopColor: theme.border, marginTop: 12, paddingTop: 12 }]}>
                  {/* Content Type Filter */}
                  <View style={styles.filterSection}>
                    <Text style={[styles.filterLabel, { color: theme.muted }]}>Type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                      {["all", "movie", "series"].map((type) => {
                        const isActive = filterType === type
                        return (
                          <TouchableOpacity
                            key={type}
                            onPress={() => setFilterType(type)}
                            style={[styles.filterChip, { backgroundColor: isActive ? `${accentColor}15` : theme.surface, borderColor: isActive ? accentColor : theme.border }]}
                          >
                            <Text style={[styles.chipText, { color: isActive ? accentColor : theme.foreground, fontFamily: isActive ? "GeneralSans-Bold" : "GeneralSans-Medium" }]}>
                              {type === "all" ? "All" : type === "movie" ? "Movies" : "Series"}
                            </Text>
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>
                  </View>

                  {/* Platforms Filter */}
                  <View style={styles.filterSection}>
                    <Text style={[styles.filterLabel, { color: theme.muted }]}>Platform</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                      {["all", "netflix", "disney", "prime", "apple"].map((plat) => {
                        const isActive = filterPlatform === plat
                        return (
                          <TouchableOpacity
                            key={plat}
                            onPress={() => setFilterPlatform(plat)}
                            style={[styles.filterChip, { backgroundColor: isActive ? `${accentColor}15` : theme.surface, borderColor: isActive ? accentColor : theme.border }]}
                          >
                            <Text style={[styles.chipText, { color: isActive ? accentColor : theme.foreground, fontFamily: isActive ? "GeneralSans-Bold" : "GeneralSans-Medium" }]}>
                              {plat === "all" ? "All" : plat === "netflix" ? "Netflix" : plat === "disney" ? "Disney+" : plat === "prime" ? "Prime Video" : "Apple TV+"}
                            </Text>
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>
                  </View>

                  {/* Languages Filter */}
                  <View style={styles.filterSection}>
                    <Text style={[styles.filterLabel, { color: theme.muted }]}>Language</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                      {["all", "en", "hi", "es", "ja", "ko", "fr"].map((lang) => {
                        const isActive = filterLanguage === lang
                        return (
                          <TouchableOpacity
                            key={lang}
                            onPress={() => setFilterLanguage(lang)}
                            style={[styles.filterChip, { backgroundColor: isActive ? `${accentColor}15` : theme.surface, borderColor: isActive ? accentColor : theme.border }]}
                          >
                            <Text style={[styles.chipText, { color: isActive ? accentColor : theme.foreground, fontFamily: isActive ? "GeneralSans-Bold" : "GeneralSans-Medium" }]}>
                              {lang === "all" ? "All" : lang === "en" ? "English" : lang === "hi" ? "Hindi" : lang === "es" ? "Spanish" : lang === "ja" ? "Japanese" : lang === "ko" ? "Korean" : "French"}
                            </Text>
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>
                  </View>

                  {/* Countries Filter */}
                  <View style={styles.filterSection}>
                    <Text style={[styles.filterLabel, { color: theme.muted }]}>Country</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                      {["all", "US", "IN", "GB", "KR", "JP", "ES", "FR"].map((cnt) => {
                        const isActive = filterCountry === cnt
                        return (
                          <TouchableOpacity
                            key={cnt}
                            onPress={() => setFilterCountry(cnt)}
                            style={[styles.filterChip, { backgroundColor: isActive ? `${accentColor}15` : theme.surface, borderColor: isActive ? accentColor : theme.border }]}
                          >
                            <Text style={[styles.chipText, { color: isActive ? accentColor : theme.foreground, fontFamily: isActive ? "GeneralSans-Bold" : "GeneralSans-Medium" }]}>
                              {cnt === "all" ? "All" : cnt === "US" ? "USA" : cnt === "IN" ? "India" : cnt === "GB" ? "UK" : cnt === "KR" ? "Korea" : cnt === "JP" ? "Japan" : cnt === "ES" ? "Spain" : "France"}
                            </Text>
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>
                  </View>

                  {/* Release Years Filter */}
                  <View style={styles.filterSection}>
                    <Text style={[styles.filterLabel, { color: theme.muted }]}>Year</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                      {["all", "2026", "2025", "2024", "2023", "2022", "2021", "2020"].map((yr) => {
                        const isActive = filterYear === yr
                        return (
                          <TouchableOpacity
                            key={yr}
                            onPress={() => setFilterYear(yr)}
                            style={[styles.filterChip, { backgroundColor: isActive ? `${accentColor}15` : theme.surface, borderColor: isActive ? accentColor : theme.border }]}
                          >
                            <Text style={[styles.chipText, { color: isActive ? accentColor : theme.foreground, fontFamily: isActive ? "GeneralSans-Bold" : "GeneralSans-Medium" }]}>
                              {yr === "all" ? "All" : yr}
                            </Text>
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>
                  </View>

                  {/* Clear Button */}
                  {(filterLanguage !== "all" || filterCountry !== "all" || filterYear !== "all" || filterPlatform !== "all" || filterType !== "all") && (
                    <TouchableOpacity
                      style={[styles.clearFiltersBtn, { borderColor: accentColor, borderWidth: 1 }]}
                      onPress={() => {
                        setFilterLanguage("all")
                        setFilterCountry("all")
                        setFilterYear("all")
                        setFilterPlatform("all")
                        setFilterType("all")
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.clearFiltersBtnText, { color: accentColor }]}>Reset All Filters</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
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
    zIndex: 10,
    height: 60,
  },
  headerContentWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
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
    fontFamily: "GeneralSans-Bold",
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingTop: 72,
    paddingBottom: 100,
  },
  segmentedControlContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
    marginTop: 8
  },
  segmentButton: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  segmentText: {
    fontSize: 12,
  },
  filterControls: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "GeneralSans-Medium",
    height: "100%",
    padding: 0,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sortLabel: {
    fontSize: 12,
    fontFamily: "GeneralSans-Semibold",
  },
  sortChips: {
    flexDirection: "row",
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  sortChipText: {
    fontSize: 11,
    fontFamily: "GeneralSans-Bold",
  },
  gridRowWrapper: {
    justifyContent: "flex-start",
    paddingHorizontal: 12,
  },
  gridCard: {
    width: "33.33%",
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  posterContainer: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 8,
    overflow: "hidden",
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  playBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  progressBar: {
    height: "100%",
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: "GeneralSans-Semibold",
    marginTop: 6,
  },
  cardSubtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  cardProgressText: {
    fontSize: 10,
    fontFamily: "GeneralSans-Medium",
  },
  cardRating: {
    fontSize: 10,
    fontFamily: "GeneralSans-Bold",
  },
  cardType: {
    fontSize: 10,
    fontFamily: "GeneralSans-Medium",
    marginTop: 2,
  },
  ratingBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.72)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "GeneralSans-Bold",
  },
  downloadRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  downloadPoster: {
    width: 50,
    height: 75,
    borderRadius: 8,
    resizeMode: "cover",
  },
  downloadDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  downloadTitle: {
    fontSize: 14,
    fontFamily: "GeneralSans-Semibold",
  },
  downloadMeta: {
    fontSize: 11,
    fontFamily: "GeneralSans-Medium",
    marginTop: 3,
  },
  downloadStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadProgressIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  statsCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  statsCardTitle: {
    fontSize: 14,
    fontFamily: "GeneralSans-Bold",
    marginBottom: 12,
  },
  statsMetricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricBox: {
    flex: 1,
    alignItems: "center",
  },
  metricVal: {
    fontSize: 18,
    fontFamily: "GeneralSans-Bold",
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: "GeneralSans-Medium",
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 28,
  },
  advancedFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  advancedFilterBtnText: {
    fontSize: 11,
    fontFamily: "GeneralSans-Bold",
  },
  filterDrawer: {
    width: "100%",
    gap: 12,
  },
  filterSection: {
    width: "100%",
  },
  filterLabel: {
    fontSize: 11,
    fontFamily: "GeneralSans-Semibold",
    marginBottom: 6,
  },
  chipScroll: {
    gap: 6,
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
  },
  clearFiltersBtn: {
    width: "100%",
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  clearFiltersBtnText: {
    fontSize: 12,
    fontFamily: "GeneralSans-Bold",
  }
})