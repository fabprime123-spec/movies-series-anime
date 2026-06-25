import { NavigationContainer } from "@react-navigation/native"
import { StackNavigator } from "./StackNavigator"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "react-native"
import { useTheme } from "../context/ThemeContext"

export function Router() {
  const { theme, mode } = useTheme()

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>

      <StatusBar backgroundColor={theme.background} animated barStyle={mode === "light" ? "dark-content" : "light-content"} />
    </SafeAreaProvider>
  )
}