import { Text, View } from "react-native"
import { Container } from "../components/ui/Container"

export function HomeScreen() {
  return (
    <Container>
      <Text style={{ color: 'white' }}>Home</Text>
      <View style={{ height: 50, aspectRatio: 1, borderRadius: 1400, backgroundColor: "#f900a0", position: "absolute", top: "50%", left: "50%", transform: [{ translateX: "-50%" }, { translateY: "-50%" }] }} />
    </Container>
  )
}