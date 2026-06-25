import { Text as RNText, StyleProp, StyleSheet, TextStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface TextProps {
  children: React.ReactNode
  style?: StyleProp<TextStyle>
}

export function Text({ children, style }: TextProps) {
  const { theme } = useTheme()

  return (
    <RNText style={[styles.text, { color: theme.text }, style]}>{children}</RNText>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "400"
  }
})