import { Image, Pressable, StyleSheet, View } from "react-native"
import { CardItem } from "../../types/card.type"
import { Text } from "../ui/Text"
import { useNavigation, StackActions } from "@react-navigation/native"
import React, { memo } from "react"

interface Props {
  item: CardItem
  onPress?: () => void
}

export const LandscapeCard = memo(function LandscapeCard({
  item,
  onPress
}: Props) {
  const navigation = useNavigation()

  const handlePress = onPress || (() => {
    navigation.dispatch(StackActions.push("Details", { id: item.id, type: item.type }))
  })

  return (
    <Pressable
      style={styles.card}
      onPress={handlePress}
    >
      <Image
        source={{
          uri: item.backdrop
            ? `https://image.tmdb.org/t/p/w500${item.backdrop}`
            : `https://image.tmdb.org/t/p/w500${item.poster}`
        }}
        style={styles.backdrop}
      />
      <View style={styles.details}>
        <Text
          numberOfLines={1}
          style={styles.title}
        >
          {item.title}
        </Text>
        <Text
          style={styles.rating}
        >
          ⭐ {item.rating.toFixed(1)}
        </Text>
      </View>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  card: {
    width: 190,
    gap: 6
  },
  backdrop: {
    width: 190,
    height: 107, // 16:9 ratio approximately (190 / 1.78 = 107)
    borderRadius: 10,
    backgroundColor: "#222",
    resizeMode: "cover"
  },
  title: {
    fontSize: 13,
    fontFamily: "GeneralSans-Medium",
    width: "75%"
  },
  rating: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  }
})
