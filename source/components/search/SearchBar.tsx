import { useState } from "react"
import {
  Pressable,
  StyleSheet,
  TextInput,
  View
} from "react-native"

import { useTheme } from "../../context/ThemeContext"
import { Search, X } from "lucide-react-native"

interface Props {
  value: string
  onChangeText: (text: string) => void
  onSubmitEditing?: () => void
}

export function SearchBar({
  value,
  onChangeText,
  onSubmitEditing
}: Props) {
  const { theme, accentColor } = useTheme()
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused ? accentColor : theme.border,
          borderWidth: 1,
          backgroundColor: theme.background
        }
      ]}
    >
      <Search color={isFocused ? accentColor : theme.foreground} style={styles.icon} size={20} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search movies, series, anime..."
        placeholderTextColor={theme.muted}
        style={[styles.input, {
          color: theme.foreground,
          fontFamily: "GeneralSans-Medium"
        }]}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={onSubmitEditing}
      />

      {
        value.length > 0 &&
        <Pressable onPress={() => onChangeText("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <X color={theme.foreground} size={20} />
        </Pressable>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 1
  },
  icon: {
    fontSize: 18,
    marginRight: 10
  },
  input: {
    height: "auto",
    flex: 1,
    fontSize: 16
  },
  clear: {
    fontSize: 18
  }
})