import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, ViewStyle } from 'react-native';

export interface AudioProps {
  size?: number;
  color?: string;
  speed?: number;
  style?: ViewStyle;
}

export default function Audio({
  size = 40,
  color = '#10b981',
  speed = 1000,
  style,
}: AudioProps) {
  const bar1 = useRef(new Animated.Value(0)).current;
  const bar2 = useRef(new Animated.Value(0)).current;
  const bar3 = useRef(new Animated.Value(0)).current;
  const bar4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateBar = (value: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      );
    };

    // Non-synchronized timings
    const anim1 = animateBar(bar1, speed * 0.43);
    const anim2 = animateBar(bar2, speed * 0.67);
    const anim3 = animateBar(bar3, speed * 0.37);
    const anim4 = animateBar(bar4, speed * 0.53);

    Animated.parallel([anim1, anim2, anim3, anim4]).start();

    return () => {
      bar1.stopAnimation();
      bar2.stopAnimation();
      bar3.stopAnimation();
      bar4.stopAnimation();
    };
  }, [bar1, bar2, bar3, bar4, speed]);

  const barWidth = size * 0.15;
  const spacing = size * 0.05;
  const maxBarHeight = size * 0.8;
  const minBarHeight = barWidth;

  const getBarStyle = (value: Animated.Value) => {
    const height = value.interpolate({
      inputRange: [0, 1],
      outputRange: [minBarHeight, maxBarHeight],
    });

    const opacity = value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.35, 1.0],
    });

    return {
      width: barWidth,
      height,
      borderRadius: barWidth / 2,
      backgroundColor: color,
      marginHorizontal: spacing,
      opacity,
    };
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View style={getBarStyle(bar1)} />
      <Animated.View style={getBarStyle(bar2)} />
      <Animated.View style={getBarStyle(bar3)} />
      <Animated.View style={getBarStyle(bar4)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});


