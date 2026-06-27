import React from "react"
import { Image, StyleSheet, TouchableOpacity, View, Dimensions } from "react-native"
import { CardItem } from "../../types/card.type"
import { useTheme } from "../../context/ThemeContext"
import { Text } from "../ui/Text"
import { Ban, Star } from "lucide-react-native"
import { StackActions, useNavigation } from "@react-navigation/native"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CARD_WIDTH = (SCREEN_WIDTH - 52) / 3 // 3 columns with outer padding (20px), list padding (16px), and two gaps of 8px (16px)

interface SearchCardProps {
  item: CardItem
}

export function SearchCard({ item }: SearchCardProps) {
  const { theme, accentColor } = useTheme()
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(StackActions.push("Details", { id: item.id, type: item.type }))}
      style={styles.card}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, { backgroundColor: theme.surface }]}>
        {item.poster ? (
          <Image
            style={styles.image}
            source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster}` }}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ban size={24} color={accentColor} />
            <Text style={styles.placeholderText}>No Poster Available</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Star size={9} color="#FFD700" fill="#FFD700" style={{ marginRight: 2 }} />
          <Text style={styles.ratingText}>{item.rating ? item.rating.toFixed(1) : "N/A"}</Text>
        </View>
      </View>
      <Text numberOfLines={1} style={[styles.title, { color: theme.foreground }]}>
        {item.title}
      </Text>
      <Text numberOfLines={1} style={[styles.subtitle, { color: theme.muted }]}>
        {item.type === "movie" ? "Movie" : "Series"}  •  {item.release_date ? item.release_date.slice(0, 4) : "N/A"}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    gap: 4,
  },
  imageContainer: {
    width: "100%",
    height: CARD_WIDTH * 1.5, // 2:3 aspect ratio
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "ClashGrotesk-Medium",
    marginTop: 5
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
  ratingText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "GeneralSans-Bold",
  },
  title: {
    fontSize: 12,
    fontFamily: "GeneralSans-Semibold",
    paddingHorizontal: 2,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: "GeneralSans-Medium",
    paddingHorizontal: 2,
  }
})