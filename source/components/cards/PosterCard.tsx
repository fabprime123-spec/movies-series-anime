import { StyleSheet, View } from "react-native"

interface PosterProps {
  title: string
  images: string
}

export function PosterCard({ title, images }: PosterProps) {
  return (
    <View></View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    aspectRatio: 1 / 2,
    backgroundColor: "transparent"
  },
  image: {
    width: 130,
    aspectRatio: 1 / 1.4,
    borderRadius: 10
  }
})