import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, ViewStyle } from 'react-native';

export interface PingPongProps {
  size?: number;
  color?: string;
  speed?: number;
  style?: ViewStyle;
}

export default function PingPong({
  size = 40,
  color = '#ffffff',
  speed = 1000,
  style,
}: PingPongProps) {
  const pingValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pingValue, {
          toValue: 1,
          duration: speed * 0.5,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pingValue, {
          toValue: 0,
          duration: speed * 0.5,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      pingValue.stopAnimation();
    };
  }, [pingValue, speed]);

  const ballSize = size * 0.22;
  const rangeX = (size - ballSize) * 0.45;
  const rangeY = (size - ballSize) * 0.45;

  const translateX = pingValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-rangeX, 0, rangeX],
  });

  const translateY = pingValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -rangeY, 0],
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View
        style={{
          width: ballSize,
          height: ballSize,
          borderRadius: ballSize / 2,
          backgroundColor: color,
          transform: [{ translateX }, { translateY }],
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

