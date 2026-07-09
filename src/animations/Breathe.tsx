import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, ViewStyle } from 'react-native';

export interface BreatheProps {
  size?: number;
  color?: string;
  speed?: number;
  style?: ViewStyle;
}

export default function Breathe({
  size = 40,
  color = '#0f766e',
  speed = 1800,
  style,
}: BreatheProps) {
  const breatheValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheValue, {
          toValue: 1,
          duration: speed * 0.5,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheValue, {
          toValue: 0,
          duration: speed * 0.5,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      breatheValue.stopAnimation();
    };
  }, [breatheValue, speed]);

  const scale = breatheValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.75, 1.25],
  });

  const overallOpacity = breatheValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  // Cross-fade shape from square to circle
  const squareOpacity = breatheValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const circleOpacity = breatheValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const boxSize = size * 0.55;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View
        style={{
          width: boxSize,
          height: boxSize,
          transform: [{ scale }],
          opacity: overallOpacity,
        }}
      >
        {/* Square shape (active at minimum scale) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: boxSize * 0.15,
              backgroundColor: color,
              opacity: squareOpacity,
            },
          ]}
        />
        {/* Circle shape (active at maximum scale) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: boxSize / 2,
              backgroundColor: color,
              opacity: circleOpacity,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});


