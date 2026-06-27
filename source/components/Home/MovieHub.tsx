import React, { useState, useMemo } from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { CardItem } from "../../types/card.type"
import { MediaSlider } from "../sliders/MediaSlider"
import { Text } from "../ui/Text"
import { useTheme } from "../../context/ThemeContext"
import { Film, Play, Flame, Trophy, Calendar } from "lucide-react-native"

interface Props {
  nowPlaying: CardItem[]
  popular: CardItem[]
  topRated: CardItem[]
  upcoming: CardItem[]
}

type TabType = "now_playing" | "popular" | "top_rated" | "upcoming"

export function MovieHub({ nowPlaying, popular, topRated, upcoming }: Props) {
  const { theme, accentColor } = useTheme()
  const [activeTab, setActiveTab] = useState<TabType>("now_playing")

  const activeData = useMemo(() => {
    switch (activeTab) {
      case "now_playing":
        return nowPlaying
      case "popular":
        return popular
      case "top_rated":
        return topRated
      case "upcoming":
        return upcoming
      default:
        return []
    }
  }, [activeTab, nowPlaying, popular, topRated, upcoming])

  const tabs = [
    { key: "now_playing" as const, label: "Now Playing", icon: Play },
    { key: "popular" as const, label: "Popular", icon: Flame },
    { key: "top_rated" as const, label: "Top Rated", icon: Trophy },
    { key: "upcoming" as const, label: "Upcoming", icon: Calendar }
  ]

  return (
    <View style={[styles.hubContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.hubHeader}>
        <View style={styles.titleContainer}>
          <Film size={20} color={accentColor} />
          <Text style={[styles.hubTitle, { color: theme.foreground }]}>Movies Hub</Text>
        </View>
        <View style={[styles.hubBadge, { backgroundColor: theme.background }]}>
          <Text style={[styles.hubBadgeText, { color: accentColor }]}>COLLECTION</Text>
        </View>
      </View>

      {/* 2x2 Grid of selectors */}
      <View style={styles.gridContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          const TabIcon = tab.icon
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.gridTile,
                isActive
                  ? { backgroundColor: accentColor, borderColor: accentColor }
                  : { backgroundColor: theme.background, borderColor: theme.border }
              ]}
              activeOpacity={0.8}
            >
              <TabIcon size={16} color={isActive ? "#FFFFFF" : theme.foreground} />
              <Text
                numberOfLines={2}
                style={[
                  styles.tileText,
                  isActive ? { color: "#FFFFFF", fontFamily: "GeneralSans-Bold" } : { color: theme.foreground }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Media Slider (Always poster aspect ratio) */}
      <View style={styles.hubSliderWrapper}>
        <MediaSlider
          key={`movie-slider-${activeTab}`}
          data={activeData}
          type="poster"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  hubContainer: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  hubHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hubTitle: {
    fontSize: 18,
    fontFamily: "ClashGrotesk-Bold",
  },
  hubBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hubBadgeText: {
    fontSize: 10,
    fontFamily: "GeneralSans-Bold",
    letterSpacing: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  gridTile: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  tileText: {
    fontSize: 12,
    fontFamily: "GeneralSans-Semibold",
    flex: 1,
  },
  hubSliderWrapper: {
    marginTop: 4,
  }
})
