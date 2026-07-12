import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { NativeGradient } from '../components/native/NativeGradient';
import { Logo } from '../components/ui/Logo';

const { width, height } = Dimensions.get('window');

export function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const { theme, accentColor } = useTheme();
  
  // Animation values
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Slight pause at start
      Animated.delay(400),
      // Scale up hugely and fade out slightly, like Netflix N
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 25,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 900,
          delay: 300,
          useNativeDriver: true,
        }),
      ])
    ]).start(() => {
      if (onFinish) onFinish();
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={{
        transform: [{ scale }],
        opacity: opacity,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Logo width={120} height={120} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
    position: 'absolute',
    zIndex: 9999,
  },
  logoText: {
    fontSize: 72,
    letterSpacing: -4,
    textShadowColor: 'rgba(255, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  }
});
