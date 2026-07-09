import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, ViewStyle } from 'react-native';

export interface SpinProps {
  size?: number;
  color?: string;
  speed?: number;
  style?: ViewStyle;
}

export default function Spin({
  size = 40,
  color = '#0288d1',
  speed = 1000,
  style,
}: SpinProps) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: speed,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    return () => {
      spinValue.stopAnimation();
    };
  }, [spinValue, speed]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Decrease overall loader size slightly as requested
  const spinnerSize = size * 0.82;
  const borderWidth = Math.max(2.5, spinnerSize * 0.1);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {/* Muted Track representing the full uncovered path */}
      <View
        style={[
          styles.track,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderRadius: spinnerSize / 2,
            borderWidth: borderWidth,
            borderColor: color,
            opacity: 0.15,
          },
        ]}
      />
      {/* Active spinner overlay */}
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderRadius: spinnerSize / 2,
            borderWidth: borderWidth,
            borderColor: 'transparent',
            borderTopColor: color,
            borderLeftColor: color,
            transform: [{ rotate: spin }],
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
  track: {
    position: 'absolute',
  },
  spinner: {
    position: 'absolute',
  },
});

