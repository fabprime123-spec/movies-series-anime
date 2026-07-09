import React from 'react'
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native'
import { useTheme } from '../../theme/ThemeContext'

export interface TextProps extends RNTextProps {
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'light' | 'extralight'
  color?: string
  size?: number
  italic?: boolean
}

export function Text({
  style,
  weight = 'regular',
  color,
  size = 14,
  italic = false,
  children,
  ...props
}: TextProps) {
  const { theme } = useTheme()

  let fontFamily = 'GeneralSans-Regular'

  if (italic) {
    switch (weight) {
      case 'bold': fontFamily = 'GeneralSans-BoldItalic'
        break
      case 'semibold': fontFamily = 'GeneralSans-SemiboldItalic'
        break
      case 'medium': fontFamily = 'GeneralSans-MediumItalic'
        break
      case 'light': fontFamily = 'GeneralSans-LightItalic'
        break
      case 'extralight': fontFamily = 'GeneralSans-ExtralightItalic'
        break
      default: fontFamily = 'GeneralSans-Italic'
        break
    }
  } else {
    switch (weight) {
      case 'bold': fontFamily = 'GeneralSans-Bold'
        break
      case 'semibold': fontFamily = 'GeneralSans-Semibold'
        break
      case 'medium': fontFamily = 'GeneralSans-Medium'
        break
      case 'light': fontFamily = 'GeneralSans-Light'
        break
      case 'extralight': fontFamily = 'GeneralSans-Extralight'
        break
      default: fontFamily = 'GeneralSans-Regular'
        break
    }
  }

  return (
    <RNText
      style={[
        {
          fontFamily,
          color: color || theme.foreground,
          fontSize: size,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  )
}
