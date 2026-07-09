import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, ViewStyle } from 'react-native';

export interface TypingProps {
  size?: number;
  color?: string;
  speed?: number;
  style?: ViewStyle;
}

export default function Typing({
  size = 40,
  color = '#cfd8dc',
  speed = 1500, // Slower typing speed
  style,
}: TypingProps) {
  const dot1 = useRef(new Animated.Value(0.2)).current;
  const dot2 = useRef(new Animated.Value(0.2)).current;
  const dot3 = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const createAnimation = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: speed * 0.25,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.2,
            duration: speed * 0.25,
            useNativeDriver: true,
          }),
          Animated.delay(Math.max(0, speed * 0.5 - delay)),
        ])
      );
    };

    // Strict left-to-right propagation
    const anim1 = createAnimation(dot1, 0);
    const anim2 = createAnimation(dot2, speed * 0.2);
    const anim3 = createAnimation(dot3, speed * 0.4);

    Animated.parallel([anim1, anim2, anim3]).start();

    return () => {
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
    };
  }, [dot1, dot2, dot3, speed]);

  const dotSize = size * 0.18;
  const spacing = dotSize * 0.4;

  const getDotStyle = (value: Animated.Value) => {
    const scale = value.interpolate({
      inputRange: [0.2, 1.0],
      outputRange: [0.85, 1.25],
    });

    return {
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      backgroundColor: color,
      marginHorizontal: spacing,
      opacity: value,
      transform: [{ scale }],
    };
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View style={[styles.dot, getDotStyle(dot1)]} />
      <Animated.View style={[styles.dot, getDotStyle(dot2)]} />
      <Animated.View style={[styles.dot, getDotStyle(dot3)]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    alignSelf: 'center',
  },
});

