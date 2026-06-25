import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { TabBar } from "./TabBar"

import { HomeScreen } from "../screens/HomeScreen"
import { LibraryScreen } from "../screens/LibraryScreen"
import { SearchScreen } from "../screens/SearchScreen"
import { ProfileScreen } from "../screens/ProfileScreen"

const Tab = createBottomTabNavigator()

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}