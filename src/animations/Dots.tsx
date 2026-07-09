import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, ViewStyle } from 'react-native';

export interface DotsProps {
  size?: number;
  color?: string;
  speed?: number;
  style?: ViewStyle;
}

export default function Dots({
  size = 40,
  color = '#29b6f6',
  speed = 1400, // Slower default speed for smooth waves
  style,
}: DotsProps) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          // Wave up
          Animated.timing(value, {
            toValue: 1,
            duration: speed * 0.35,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          // Wave down (symmetrical below the reference line)
          Animated.timing(value, {
            toValue: -1,
            duration: speed * 0.35,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          // Return to center
          Animated.timing(value, {
            toValue: 0,
            duration: speed * 0.2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(Math.max(0, speed * 0.4 - delay)),
        ])
      );
    };

    // Strict left-to-right propagation pattern
    const anim1 = createAnimation(dot1, 0);
    const anim2 = createAnimation(dot2, speed * 0.15);
    const anim3 = createAnimation(dot3, speed * 0.3);

    Animated.parallel([anim1, anim2, anim3]).start();

    return () => {
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
    };
  }, [dot1, dot2, dot3, speed]);

  const dotSize = size * 0.22;
  const spacing = dotSize * 0.3;
  const jumpHeight = -dotSize * 0.7; // Maximum vertical oscillation amplitude

  const getStyle = (value: Animated.Value) => {
    const translateY = value.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [-jumpHeight, 0, jumpHeight], // oscillates above and below center line
    });
    return {
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      backgroundColor: color,
      marginHorizontal: spacing,
      transform: [{ translateY }],
    };
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View style={getStyle(dot1)} />
      <Animated.View style={getStyle(dot2)} />
      <Animated.View style={getStyle(dot3)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

