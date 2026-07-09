import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, Animated, ViewStyle } from 'react-native'

export interface RadarProps {
  size?: number
  color?: string
  speed?: number
  style?: ViewStyle
}

export default function Radar({
  size = 40,
  color = '#00acc1',
  speed = 1800,
  style,
}: RadarProps) {
  const sweep1 = useRef(new Animated.Value(0)).current
  const sweep2 = useRef(new Animated.Value(0)).current
  const sweep3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const createSweepAnimation = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: speed * 0.8,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.delay(Math.max(0, speed * 0.2 - delay)),
        ])
      )
    }

    const anim1 = createSweepAnimation(sweep1, 0)
    const anim2 = createSweepAnimation(sweep2, speed * 0.33)
    const anim3 = createSweepAnimation(sweep3, speed * 0.66)

    Animated.parallel([anim1, anim2, anim3]).start()

    return () => {
      sweep1.stopAnimation()
      sweep2.stopAnimation()
      sweep3.stopAnimation()
    }
  }, [sweep1, sweep2, sweep3, speed])

  const outerSize = size * 0.85
  const dotSize = size * 0.16
  const borderWidth = Math.max(1, size * 0.035)

  const getRingStyle = (value: Animated.Value) => {
    const scale = value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.15, 1.0],
    })

    const opacity = value.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 0.65, 0.3, 0],
    })

    return {
      position: 'absolute' as const,
      width: outerSize,
      height: outerSize,
      borderRadius: outerSize / 2,
      borderWidth: borderWidth,
      borderColor: color,
      backgroundColor: 'transparent',
      transform: [{ scale }],
      opacity,
    }
  }

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {/* Outer Outline Circle */}
      {/* <View
        style={[
          styles.outerRing,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            borderColor: color,
            borderWidth: borderWidth,
            opacity: 0.3,
          },
        ]}
      /> */}

      {/* Expanding Radar Outline Pings */}
      <Animated.View style={getRingStyle(sweep1)} />
      <Animated.View style={getRingStyle(sweep2)} />
      <Animated.View style={getRingStyle(sweep3)} />

      {/* Center Beacon */}
      <View
        style={[
          styles.beacon,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
  },
  beacon: {
    position: 'absolute',
  },
})

