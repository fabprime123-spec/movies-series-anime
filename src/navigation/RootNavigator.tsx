import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TabNavigator } from './TabNavigator'
import { DetailScreen } from '../screens/DetailScreen'
import { SettingsScreen } from '../screens/SettingsScreen'
import { SeasonScreen } from '../screens/SeasonScreen'
import { VerticalImageScreen } from '../screens/VerticalImageScreen'
import { ImageViewerScreen } from '../screens/ImageViewerScreen'
import { LoginScreen } from '../screens/LoginScreen'
import { useAuth } from '../store/AuthContext'
import { ActivityIndicator, View } from 'react-native'
import { useTheme } from '../theme/ThemeContext'
import { SplashScreen } from '../screens/SplashScreen'
import { useSettings } from '../store/SettingsContext'

const Stack = createNativeStackNavigator()

export function RootNavigator() {
  const { user, isLoading } = useAuth()
  const { theme } = useTheme()

  const [splashFinished, setSplashFinished] = React.useState(false)

  if (isLoading || !splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user == null ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ animation: "fade" }}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ animation: "fade_from_bottom" }}
          />
          <Stack.Screen
            name="Details"
            component={DetailScreen}
            options={{ animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="Season"
            component={SeasonScreen}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="VerticalImage"
            component={VerticalImageScreen}
            options={{ animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="ImageViewer"
            component={ImageViewerScreen}
            options={{ animation: "fade" }}
          />
        </>
      )}
    </Stack.Navigator>
  )
}