import { Image, Pressable, StyleSheet } from "react-native"
import { CardItem } from "../../types/card.type"
import { Text } from "../ui/Text"
import { Container } from "../ui/Container"

type Props = {
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
    fontWeight: "600"
  },
  rating: {
    fontSize: 12
  }
})