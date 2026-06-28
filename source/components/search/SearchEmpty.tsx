import React from "react"
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native"
import { Text } from "../ui/Text"
import { Search, Flame, History, X, Trash2 } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { MediaSlider } from "../sliders/MediaSlider"
import { CardItem } from "../../types/card.type"

interface Props {
  recentSearches: string[]
  onSelectRecent: (query: string) => void
  onRemoveRecent: (query: string) => void
  onClearRecent: () => void
  trending: CardItem[]
  isLoadingTrending: boolean
  contentContainerStyle?: any
  onSurpriseMe: (id: number, type: "movie" | "series") => void
}

const CATEGORIES = [
  "Action",
  "Sci-Fi",
  "Anime",
  "Documentary",
  "K-Drama",
  "Fantasy",
  "Music",
  "Comedy",
  "Thriller",
  "Horror"
]

export function SearchEmpty({
  recentSearches,
  onSelectRecent,
  onRemoveRecent,
  onClearRecent,
  trending,
  isLoadingTrending,
  contentContainerStyle,
  onSurpriseMe
}: Props) {
  const { theme, accentColor } = useTheme()

  const hasRecent = recentSearches.length > 0
  const hasTrending = trending.length > 0

  if (!hasRecent && !hasTrending && isLoadingTrending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={accentColor} />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Surprise Me Banner */}
      {hasTrending && (
        <TouchableOpacity
          style={[styles.surpriseCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => {
            const randomItem = trending[Math.floor(Math.random() * trending.length)]
            if (randomItem) {
              onSurpriseMe(randomItem.id, randomItem.type)
            }
          }}
          activeOpacity={0.8}
        >
          <View style={styles.surpriseLeft}>
            <Text style={[styles.surpriseTitle, { color: theme.foreground }]}>Can't decide? 🎲</Text>
            <Text style={[styles.surpriseSub, { color: theme.muted }]}>Let us surprise you with a random trending movie or show!</Text>
          </View>
          <View style={[styles.surpriseBtn, { backgroundColor: accentColor }]}>
            <Text style={styles.surpriseBtnText}>Spin</Text>
          </View>
        </TouchableOpacity>
      )}
      {/* 1. Recent Searches */}
      {hasRecent && (
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <View style={styles.titleWithIcon}>
              <History size={18} color={accentColor} style={styles.headerIcon} />
              <Text style={styles.sectionTitle}>Recent Searches</Text>
            </View>
            <TouchableOpacity onPress={onClearRecent} style={styles.clearButton} activeOpacity={0.7}>
              <Trash2 size={15} color={theme.muted} />
              <Text style={[styles.clearText, { color: theme.muted }]}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chipsContainer}>
            {recentSearches.map((item, index) => (
              <Pressable
                key={`${item}-${index}`}
                onPress={() => onSelectRecent(item)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    opacity: pressed ? 0.8 : 1
                  }
                ]}
              >
                <Text style={[styles.chipText, { color: theme.foreground }]}>{item}</Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation()
                    onRemoveRecent(item)
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={14} color={theme.muted} />
                </TouchableOpacity>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* 2. Explore Categories (Quick-Search Tag Shelf) */}
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <View style={styles.titleWithIcon}>
            <Search size={18} color={accentColor} style={styles.headerIcon} />
            <Text style={styles.sectionTitle}>Explore Categories</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => onSelectRecent(cat)}
              style={[styles.categoryChip, { backgroundColor: theme.card, borderColor: theme.border }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryChipText, { color: theme.foreground }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Trending Today */}
      {hasTrending && (
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <View style={styles.titleWithIcon}>
              <Flame size={18} color="#FF6B6B" style={styles.headerIcon} />
              <Text style={styles.sectionTitle}>Trending Today</Text>
            </View>
          </View>
          <MediaSlider data={trending} />
        </View>
      )}

      {/* 4. Fallback Default Container */}
      {!hasRecent && !hasTrending && (
        <View style={styles.fallbackContainer}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.card }]}>
            <Search color={accentColor} size={36} />
          </View>
          <Text style={styles.title}>Search Movies & Series</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Find movies, series, anime, documentaries, K-Dramas, C-Dramas and much more.
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 16
  },
  contentContainer: {
    paddingTop: 0,
    paddingBottom: 100,
    gap: 28,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  section: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "GeneralSans-Semibold",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  clearText: {
    fontSize: 13,
    fontFamily: "GeneralSans-Medium",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    fontFamily: "GeneralSans-Medium",
  },
  categoriesContainer: {
    paddingHorizontal: 4,
    gap: 8,
    paddingBottom: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryChipText: {
    fontSize: 13,
    fontFamily: "GeneralSans-Semibold",
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 80,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "GeneralSans-Semibold",
    marginBottom: 10,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "GeneralSans-Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  surpriseCard: {
    marginHorizontal: 4,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  surpriseLeft: {
    flex: 1,
  },
  surpriseTitle: {
    fontSize: 15,
    fontFamily: "GeneralSans-Bold",
  },
  surpriseSub: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
    marginTop: 4,
    lineHeight: 16,
  },
  surpriseBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  surpriseBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "GeneralSans-Bold",
  }
})