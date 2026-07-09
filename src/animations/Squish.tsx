import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, ViewStyle } from 'react-native';

export interface SquishProps {
  size?: number;
  color?: string;
  speed?: number;
  style?: ViewStyle;
}

export default function Squish({
  size = 40,
  color = '#ea580c',
  speed = 1200,
  style,
}: SquishProps) {
  const squishValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(squishValue, {
          toValue: 1,
          duration: speed * 0.25,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(squishValue, {
          toValue: -1,
          duration: speed * 0.5,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(squishValue, {
          toValue: 0,
          duration: speed * 0.25,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      squishValue.stopAnimation();
    };
  }, [squishValue, speed]);

  const scaleX = squishValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [1.25, 1.0, 0.75],
  });

  const scaleY = squishValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0.75, 1.0, 1.25],
  });

  const boxSize = size * 0.55;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View
        style={{
          width: boxSize,
          height: boxSize,
          borderRadius: boxSize * 0.3,
          backgroundColor: color,
          transform: [
            { scaleX },
            { scaleY },
          ],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
