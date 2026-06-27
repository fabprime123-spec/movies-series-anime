import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { StackNavigator } from "./StackNavigator"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar, View, ActivityIndicator } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { AuthProvider, useAuth } from "../context/AuthContext"
import { LoginScreen } from "../screens/LoginScreen"

function NavigationWrapper() {
  const { theme, mode } = useTheme()
  const { isLoading, isAuthenticated } = useAuth()

  const navigationTheme = mode === "dark"
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: theme.background,
          card: theme.background,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.background,
          card: theme.background,
        },
      }

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.foreground} />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        {isAuthenticated ? <StackNavigator /> : <LoginScreen />}
      </NavigationContainer>

      <StatusBar backgroundColor={theme.background} animated barStyle={mode === "light" ? "dark-content" : "light-content"} />
    </SafeAreaProvider>
  )
}

export function Router() {
  return (
    <AuthProvider>
      <NavigationWrapper />
    </AuthProvider>
  )
}