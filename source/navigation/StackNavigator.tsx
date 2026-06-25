import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { TabNavigator } from "./TabNavigator"
import { DetailsScreen } from "../screens/DetailsScreen"

const Stack = createNativeStackNavigator()

export function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_bottom"
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  )
}