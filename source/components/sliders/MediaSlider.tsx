import { FlatList, FlatListProps, StyleSheet } from "react-native"
import { CardItem } from "../../types/card.type"
import { PosterCard } from "../cards/PosterCard"

interface Props extends Omit<FlatListProps<CardItem>, "data" | "renderItem"> {
  data: CardItem[]
}

export function MediaSlider({ data, ...props }: Props) {

  return (
    <FlatList
      horizontal={true}
      data={data}
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.list}
      {...props}
      renderItem={({ item }) => (<PosterCard item={item} />)}

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