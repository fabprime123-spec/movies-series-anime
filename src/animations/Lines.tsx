import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, ViewStyle } from 'react-native';

export interface LinesProps {
  size?: number;
  color?: string;
  speed?: number;
  style?: ViewStyle;
}

export default function Lines({
  size = 40,
  color = '#94a3b8',
  speed = 1000,
  style,
}: LinesProps) {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: speed,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    return () => {
      rotateValue.stopAnimation();
    };
  }, [rotateValue, speed]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const tickCount = 12;
  const ticks = Array.from({ length: tickCount });

  const tickWidth = Math.max(1.5, size * 0.055);
  const tickHeight = size * 0.22;
  const radius = size * 0.26;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ rotate }],
        },
        style,
      ]}
    >
      {ticks.map((_, i) => {
        const angle = (i * 360) / tickCount;
        const opacity = 1 - (i / tickCount) * 0.75;

        return (
          <View
            key={i}
            style={[
              styles.tick,
              {
                width: tickWidth,
                height: tickHeight,
                borderRadius: tickWidth / 2,
                backgroundColor: color,
                opacity,
                transform: [
                  { rotate: `${angle}deg` },
                  { translateY: -radius },
                ],
              },
            ]}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    position: 'absolute',
  },
});
