import { ActivityIndicator, StyleSheet, Pressable, Linking, Alert } from "react-native"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useDetails } from "../hooks/useDetails"
import { normalizeDetails } from "../utils/normalize.details"
import { DetailsContent } from "../components/details/DetailsContent"
import { useTheme } from "../context/ThemeContext"
import { ChevronLeft } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

export function DetailsScreen() {
  const navigation = useNavigation()
  const route = useRoute<any>()
  const { id, type } = route.params || {}
  const { theme } = useTheme()

  const detailsType: "movie" | "movies" | "series" = (type === "movie" || type === "movies" || type === "series") ? type : "movie"
  const { data, isLoading, error } = useDetails({ id, type: detailsType })

  if (isLoading) {
    return (
      <Container style={styles.center}>
        <ActivityIndicator size="large" color={theme.foreground} />
      </Container>
    )
  }

  if (error || !data) {
    return (
      <Container style={styles.center}>
        <Text style={{ marginBottom: 16 }}>Failed to load details.</Text>
        <Pressable style={[styles.backButton, { borderColor: theme.border, backgroundColor: theme.surface }]} onPress={() => navigation.goBack()}>
          <Text style={{ color: theme.foreground }}>Go Back</Text>
        </Pressable>
      </Container>
    )
  }

  const details = normalizeDetails(data)

  const handlePlay = () => {
    const trailer = details.trailers?.[0]
    if (trailer?.key) {
      Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`).catch(() => {
        Alert.alert("Error", "Could not open video URL.")
      })
    } else {
      Alert.alert("Trailer Unavailable", "No YouTube trailer found for this title.")
    }
  }

  return (
    <Container style={{ backgroundColor: theme.background }}>

      {/* Floating Back Button */}
      <Pressable
        style={[styles.floatingBack, { borderColor: theme.border, backgroundColor: theme.background + "77" }]}
        onPress={() => navigation.goBack()}
      >
        <ChevronLeft size={24} color="#FFFFFF" />
      </Pressable>

      <DetailsContent details={details} onPlay={handlePlay} />
    </Container>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  floatingBack: {
    position: "absolute",
    top: 16,
    left: 18,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none"
  }
})