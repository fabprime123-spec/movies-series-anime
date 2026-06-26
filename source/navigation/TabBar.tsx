import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Pressable, StyleSheet, View } from "react-native"
import { CircleUserRound, Clapperboard, LayoutGrid, Search, Tv, TvMinimal, TvMinimalPlay, User, UserRound } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"

const icons = {
  Home: LayoutGrid,
  Search: Search,
  Library: TvMinimalPlay,
  Profile: UserRound
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
              <Icon size={30} strokeWidth={focused ? 1.8 : 1.4} color={focused ? accentColor : theme.muted} />
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
    paddingBottom: 15
  },
  button: {
    width: 55,
    height: 45,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  }
})