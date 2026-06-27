import { FlatList, FlatListProps, StyleSheet } from "react-native"
import { CardItem } from "../../types/card.type"
import { PosterCard } from "../cards/PosterCard"
import { LandscapeCard } from "../cards/LandscapeCard"

interface Props extends Omit<FlatListProps<CardItem>, "data" | "renderItem"> {
  data: CardItem[]
  type?: "poster" | "landscape"
}

export function MediaSlider({ data, type = "poster", ...props }: Props) {

  return (
    <FlatList
      horizontal={true}
      data={data}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={styles.list}
      initialNumToRender={type === "poster" ? 4 : 3}
      maxToRenderPerBatch={2}
      windowSize={3}
      removeClippedSubviews={true}
      {...props}
      renderItem={({ item }) => (
        type === "poster" ? (
          <PosterCard item={item} />
        ) : (
          <LandscapeCard item={item} />
        )
      )}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 15
  }
})