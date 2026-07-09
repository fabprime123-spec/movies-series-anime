import React from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { RootNavigator } from './RootNavigator'
import { StatusBar } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export function Router() {
  const { theme, mode, accentColor } = useTheme()

  const baseTheme = mode === 'dark' ? DarkTheme : DefaultTheme

  const navigationTheme = {
    ...baseTheme,
    dark: mode === 'dark',
    colors: {
      ...baseTheme.colors,
      primary: accentColor,
      background: theme.background,
      card: theme.card,
      text: theme.foreground,
      border: theme.border,
      notification: accentColor,
    },
  }

  return (
    <>
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={mode == "dark" ? "light-content" : "dark-content"}
      />
    </>
  )
}
