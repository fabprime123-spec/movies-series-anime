import { Text as RNText, StyleProp, StyleSheet, TextProps, TextStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { fonts } from "../../constants/fonts"

interface CustomTextProps extends TextProps {
  style?: StyleProp<TextStyle>
}

export function Text({ children, style, ...props }: CustomTextProps) {
  const { theme } = useTheme()

  return (
    <RNText
      style={[styles.text, { color: theme.foreground, fontFamily: fonts.general.regular }]}
    >
      {children}
    </RNText>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  }
})