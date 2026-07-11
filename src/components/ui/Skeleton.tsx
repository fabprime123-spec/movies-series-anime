import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, ViewStyle, DimensionValue } from 'react-native'
import { NativeGradient } from '../native/NativeGradient'
import { useTheme } from '../../theme/ThemeContext'

interface SkeletonProps {
  width: DimensionValue
  height: DimensionValue
  style?: ViewStyle
  borderRadius?: number
}

export function Skeleton({ width, height, style, borderRadius = 8 }: SkeletonProps) {
  const { theme } = useTheme()
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [animatedValue])

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  })

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.card,
          opacity,
        },
        style,
      ]}
    >
      <NativeGradient
        colors={["transparent", "rgba(255,255,255,0.1)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
})
