import { StyleSheet } from "react-native"
import { Text } from "../ui/Text"
import { Container } from "../ui/Container"

type Props = {
  title: string
}

export function SectionHeader({ title }: Props) {

  return (
    <Container
      style={styles.container}
    >
      <Text
        style={styles.text}
      >
        {title}
      </Text>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "transparent"
  },
  text: {
    fontSize: 22,
    fontWeight: "700"
  }
})