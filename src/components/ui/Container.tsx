import React from 'react'
import { View, ViewProps, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../theme/ThemeContext'

interface ContainerProps extends ViewProps {
  useSafeArea?: boolean
  contentContainerStyle?: StyleProp<ViewStyle>
}

export function Container({ style, useSafeArea = true, contentContainerStyle, children, ...props }: ContainerProps) {
  const { theme } = useTheme()

  const containerStyle = [
    styles.container,
    { backgroundColor: theme.background },
    style
  ]

  if (useSafeArea) {
    return (
      <SafeAreaView style={containerStyle} edges={['top', 'left', 'right']}>
        <View style={[styles.inner, contentContainerStyle]} {...props}>
          {children}
        </View>
      </SafeAreaView>
    )
  }

  return (
    <View style={containerStyle} {...props}>
      <View style={[styles.inner, contentContainerStyle]}>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  }
})
