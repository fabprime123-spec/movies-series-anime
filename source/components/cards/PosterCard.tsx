import { Image, Pressable, StyleSheet, View } from "react-native"
import { CardItem } from "../../types/card.type"
import { Text } from "../ui/Text"

interface Props {
  item: CardItem
  onPress?: () => void
}

export function PosterCard({
  item,
  onPress
}: Props) {

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${item.poster}`
        }}
        style={styles.poster}
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
}

const styles = StyleSheet.create({
  card: {
    width: 130,
    gap: 6
  },
  poster: {
    width: 130,
    height: 195,
    borderRadius: 10,
    backgroundColor: "#222",
    resizeMode: "cover"
  },
  title: {
    fontSize: 14,
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