import { StyleSheet, View } from "react-native"
import { Text } from "../ui/Text"

export function SectionHeader({ title }: { title: string }) {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {title}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingTop: 20,
    paddingHorizontal: 10
  },
  text: {
    fontSize: 22,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2
  }
})