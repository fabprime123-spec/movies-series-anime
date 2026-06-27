import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { TabNavigator } from "./TabNavigator"
import { DetailsScreen } from "../screens/DetailsScreen"
import { SettingsScreen } from "../screens/SettingsScreen"
import { useTheme } from "../context/ThemeContext"

const Stack = createNativeStackNavigator()

export function StackNavigator() {
  const { theme } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ animation: "none" }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          gestureEnabled: true,
          gestureDirection: "vertical",
          animationMatchesGesture: true,
          fullScreenGestureEnabled: true,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      />
    </Stack.Navigator>
  )
}