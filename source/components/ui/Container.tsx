import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../../context/ThemeContext"
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native"

interface ContainerProps extends ViewProps {
  children: React.ReactNode
}

export function Container({ children }: ContainerProps) {
  const { theme } = useTheme()

  return <SafeAreaView
    style={[styles.safe, { backgroundColor: theme.background }]}
    edges={["top"]}
  >
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {children}
    </View>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  container: {
    flex: 1
  }
})