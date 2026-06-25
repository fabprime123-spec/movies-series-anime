import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../../context/ThemeContext"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"

export function Container({ children, style }: { children: React.ReactNode, style?: StyleProp<ViewStyle> }) {
  const { theme } = useTheme()

  return <SafeAreaView
    style={[styles.safe, { backgroundColor: theme.background }]}
    edges={["top"]}
  >
    <View style={[styles.container, { backgroundColor: theme.background }, style]}>
      {children}
    </View>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#fff'
  }
})