import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, ViewStyle } from 'react-native';

export interface MorphProps {
  size?: number;
  color?: string;
  speed?: number;
  style?: ViewStyle;
}

export default function Morph({
  size = 40,
  color = '#7cb342',
  speed = 2000,
  style,
}: MorphProps) {
  const morphValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(morphValue, {
        toValue: 2,
        duration: speed,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    return () => {
      morphValue.stopAnimation();
    };
  }, [morphValue, speed]);

  const boxSize = size * 0.6;

  // Cross-fade opacity between green circle and orange square
  const circleOpacity = morphValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [1, 0, 1],
  });

  const squareOpacity = morphValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  // Interpolate rotation (0 to 360 degrees)
  const rotate = morphValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '180deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View
        style={{
          width: boxSize,
          height: boxSize,
          transform: [{ rotate }],
        }}
      >
        {/* Circle (Green / color) */}
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
        {/* Square (Orange / secondary color) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: boxSize * 0.15,
              backgroundColor: '#ea580c',
              opacity: squareOpacity,
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


