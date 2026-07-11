import React, { useState, useRef } from 'react'
import { StyleSheet, Pressable, Animated, Image } from 'react-native'
import { useTheme } from '../../theme/ThemeContext'

export function Switch() {
  const [isEnabled, setIsEnabled] = useState(false)
  const animatedValue = useRef(new Animated.Value(0)).current

  const toggleSwitch = () => {
    const toValue = isEnabled ? 0 : 1

    Animated.timing(animatedValue, {
      toValue,
      duration: 200,
      useNativeDriver: false, // Layout properties require false
    }).start()

    setIsEnabled(!isEnabled)
  }

  // Interpolate thumb movement from left to right
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Adjusted based on track and thumb width
  })

  return (
    <Pressable
      onPress={toggleSwitch}
      style={[
        styles.track,
        { backgroundColor: isEnabled ? "#e5e5ea" : '#e5e5ea' }
      ]}
    >
      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]}>
        <Image
          source={
            isEnabled
              ? require("../../../assets/dark.webp")
              : require('../../../assets/light.webp')
          }
          style={styles.image}
        />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 30,
    borderRadius: 28,
    justifyContent: 'center',
    padding: 0,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    // Soft shadow for depth
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
})