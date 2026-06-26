import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../../context/ThemeContext"
import { StyleSheet, View, ViewProps } from "react-native"

interface ContainerProps extends ViewProps {
  children: React.ReactNode
}

export function Container({ children, style, ...props }: ContainerProps) {
  const { theme } = useTheme()

  return <SafeAreaView
    style={[styles.safe, { backgroundColor: theme.background }]}
    edges={["top"]}
  >
    <View {...props} style={[styles.container, { backgroundColor: theme.background }, style]}>
      {children}
    </View>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1
  }
})