import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, ViewStyle } from 'react-native';

export interface PulseProps {
  size?: number;
  color?: string;
  speed?: number;
  style?: ViewStyle;
}

export default function Pulse({
  size = 40,
  color = '#e91e63',
  speed = 1200,
  style,
}: PulseProps) {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: speed * 0.85,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.delay(speed * 0.15),
        ])
      );
    };

    const anim1 = createAnimation(pulse1, 0);
    const anim2 = createAnimation(pulse2, speed * 0.5);

    Animated.parallel([anim1, anim2]).start();

    return () => {
      pulse1.stopAnimation();
      pulse2.stopAnimation();
    };
  }, [pulse1, pulse2, speed]);

  const coreSize = size * 0.45;

  const getRingStyle = (value: Animated.Value) => {
    const scale = value.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 2.2],
    });
    const opacity = value.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0.6, 0.4, 0],
    });

    return {
      position: 'absolute' as const,
      width: coreSize,
      height: coreSize,
      borderRadius: coreSize / 2,
      backgroundColor: color,
      transform: [{ scale }],
      opacity,
    };
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View style={getRingStyle(pulse1)} />
      <Animated.View style={getRingStyle(pulse2)} />
      <View
        style={[
          styles.core,
          {
            width: coreSize,
            height: coreSize,
            borderRadius: coreSize / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    position: 'absolute',
  },
});
