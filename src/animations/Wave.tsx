import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, ViewStyle } from 'react-native';

export interface WaveProps {
  size?: number;
  color?: string;
  speed?: number;
  style?: ViewStyle;
}

export default function Wave({
  size = 40,
  color = '#00acc1',
  speed = 1200,
  style,
}: WaveProps) {
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;
  const wave4 = useRef(new Animated.Value(0)).current;
  const wave5 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startWave = (value: Animated.Value, delay: number) => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: 1,
              duration: speed * 0.4,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(value, {
              toValue: 0,
              duration: speed * 0.4,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ])
        ),
      ]).start();
    };

    // Staggered propagation from left to right, delayed once outside the loop
    startWave(wave1, 0);
    startWave(wave2, speed * 0.15);
    startWave(wave3, speed * 0.3);
    startWave(wave4, speed * 0.45);
    startWave(wave5, speed * 0.6);

    return () => {
      wave1.stopAnimation();
      wave2.stopAnimation();
      wave3.stopAnimation();
      wave4.stopAnimation();
      wave5.stopAnimation();
    };
  }, [wave1, wave2, wave3, wave4, wave5, speed]);

  const barWidth = size * 0.1;
  const spacing = size * 0.04;
  const maxBarHeight = size * 0.75;
  const minBarHeight = barWidth;

  const getBarStyle = (value: Animated.Value) => {
    const height = value.interpolate({
      inputRange: [0, 1],
      outputRange: [minBarHeight, maxBarHeight],
    });

    return {
      width: barWidth,
      height,
      borderRadius: barWidth / 2,
      backgroundColor: color,
      marginHorizontal: spacing,
    };
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View style={getBarStyle(wave1)} />
      <Animated.View style={getBarStyle(wave2)} />
      <Animated.View style={getBarStyle(wave3)} />
      <Animated.View style={getBarStyle(wave4)} />
      <Animated.View style={getBarStyle(wave5)} />
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


