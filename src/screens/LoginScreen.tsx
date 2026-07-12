import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from "../components/ui/Text"
import { useAuth } from '../store/AuthContext';
import { Globe, User } from 'lucide-react-native';
import { Logo } from '../components/ui/Logo';

const { width, height } = Dimensions.get('window');

export function LoginScreen() {
  const { theme, accentColor } = useTheme();
  const { loginWithGoogle, loginAsGuest } = useAuth();
  const [loading, setLoading] = useState(false);

  // Animated Background
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (anim: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    createAnimation(anim1, 15000).start();
    createAnimation(anim2, 18000).start();
    createAnimation(anim3, 22000).start();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Animated Glowing Orbs */}
      <Animated.View style={[styles.orb, {
        backgroundColor: accentColor,
        opacity: 0.15,
        transform: [
          { translateX: anim1.interpolate({ inputRange: [0, 1], outputRange: [-100, width / 2] }) },
          { translateY: anim1.interpolate({ inputRange: [0, 1], outputRange: [-100, height / 2] }) },
          { scale: anim1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }) }
        ]
      }]} />

      <Animated.View style={[styles.orb, {
        backgroundColor: theme.foreground,
        opacity: 0.1,
        width: 350,
        height: 350,
        transform: [
          { translateX: anim2.interpolate({ inputRange: [0, 1], outputRange: [width, -100] }) },
          { translateY: anim2.interpolate({ inputRange: [0, 1], outputRange: [height / 2, -100] }) },
          { scale: anim2.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }) }
        ]
      }]} />

      <Animated.View style={[styles.orb, {
        backgroundColor: accentColor,
        opacity: 0.1,
        width: 400,
        height: 400,
        transform: [
          { translateX: anim3.interpolate({ inputRange: [0, 1], outputRange: [width / 2, -200] }) },
          { translateY: anim3.interpolate({ inputRange: [0, 1], outputRange: [-200, height] }) },
          { scale: anim3.interpolate({ inputRange: [0, 1], outputRange: [1.2, 0.8] }) }
        ]
      }]} />

      <View style={styles.content}>
        <Logo width={160} height={160} />
        <Text color={theme.muted} style={styles.subtitle}>
          Discover, track, and download your favorite movies and TV shows in one place.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#ffffff' }]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Image source={{ uri: "https://img.logo.dev/google.com?token=pk_cxnUR6VpRn-IQV46IhPFpQ&format=png" }} style={{ height: 20, width: 20 }} />
            <Text weight="bold" style={[styles.buttonText, { color: '#000000' }]}>
              {loading ? "Connecting..." : "Continue with Google"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
            onPress={loginAsGuest}
          >
            <User color={theme.foreground} size={24} />
            <Text weight="bold" style={[styles.buttonText, { color: theme.foreground }]}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: 0,
    left: 0,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
  }
});
