import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Pressable, StyleSheet, View } from "react-native"
import { CircleUserRound, Clapperboard, LayoutGrid, Search } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"

const icons = {
  Home: LayoutGrid,
  Search: Search,
  Library: Clapperboard,
  Profile: CircleUserRound
}

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { theme, accentColor } = useTheme()

  return (
    <LinearGradient colors={[theme.surface, theme.background]} style={[styles.container]}>
      {
        state.routes.map((route, index) => {
          const focused = state.index === index
          const Icon = icons[route.name as keyof typeof icons]

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.button]}
            >
              <Icon size={30} strokeWidth={focused ? 1.5 : 1.2} color={focused ? accentColor : theme.muted} />
            </Pressable>
          )
        })
      }
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 0,
    paddingBottom: 12
  },
  button: {
    width: 55,
    height: 45,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  }
})