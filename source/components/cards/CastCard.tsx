import { Image, StyleSheet, View } from "react-native"
import { Cast } from "../../types/details.type"
import { Text } from "../ui/Text"
import { useTheme } from "../../context/ThemeContext"
import { User } from "lucide-react-native"

interface Props {
  cast: Cast
}

export function CastCard({ cast }: Props) {
  const { theme } = useTheme()
  const imageUrl = cast.profile ? `https://image.tmdb.org/t/p/w185${cast.profile}` : null

  return (
    <View style={styles.card}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.avatar, { borderColor: theme.border }]}
        />
      ) : (
        <View style={[styles.avatar, styles.placeholder, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <User size={30} color={theme.muted} />
        </View>
      )}
      <Text numberOfLines={1} style={styles.name}>
        {cast.name}
      </Text>
      <Text numberOfLines={1} style={[styles.character, { color: theme.muted }]}>
        {cast.character}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 85,
    alignItems: "center",
    gap: 4
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    backgroundColor: "#222"
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center"
  },
  name: {
    fontSize: 12,
    fontFamily: "GeneralSans-Semibold",
    textAlign: "center",
    marginTop: 2
  },
  character: {
    fontSize: 10,
    fontFamily: "GeneralSans-Regular",
    textAlign: "center"
  }
})
