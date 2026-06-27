import { Bolt, CircleUserRound } from "lucide-react-native"
import { StyleSheet, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { Text } from "../ui/Text"

export function ProfileHeader() {
  const { theme } = useTheme()

  return (
    <View style={styles.container}>
      <CircleUserRound color={theme.foreground} size={40} strokeWidth={1} />
      <View style={styles.details}>
        <Text style={[styles.text, { color: theme.foreground }]}>夜神 月</Text>
        <Text style={[styles.text, { color: theme.foreground + "88", fontSize: 16 }]}>deathnote@gmail.com</Text>
      </View>
      <Bolt color={theme.muted} size={30} strokeWidth={1} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 10
  },
  icon: {},
  text: {
    fontSize: 20
  },
  details: {
    flex: 1
  }
})