import React, { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
} from "react-native"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { LinearGradient } from "expo-linear-gradient"
import { UserRound, Sparkles, Film, Shield, Cloud, Star } from "lucide-react-native"

const { width, height } = Dimensions.get("window")

export function LoginScreen() {
  const { accentColor } = useTheme()
  const { signInWithGoogle, loginAsGuest } = useAuth()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGuestLoading, setIsGuestLoading] = useState(false)

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(40)).current
  const logoScale = useRef(new Animated.Value(0.8)).current
  const glowAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Entrance animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      ]),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start()

    // Pulsing glow on logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start()
  }, [])

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] })

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true)
      await signInWithGoogle()
    } catch (e) {
      console.error(e)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleGuest = async () => {
    try {
      setIsGuestLoading(true)
      await new Promise(r => setTimeout(r, 600))
      await loginAsGuest()
    } catch (e) {
      console.error(e)
    } finally {
      setIsGuestLoading(false)
    }
  }

  return (
    <Container style={styles.root}>
      {/* Deep space background */}
      <LinearGradient
        colors={["#000000", "#06000F", "#0D001A", "#000000"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative ambient blobs */}
      <Animated.View style={[styles.blob1, { opacity: glowOpacity, backgroundColor: `${accentColor}30` }]} />
      <Animated.View style={[styles.blob2, { opacity: glowOpacity }]} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

        {/* ── Logo ──────────────────────────────────────── */}
        <Animated.View style={[styles.logoSection, { transform: [{ scale: logoScale }] }]}>
          {/* Glow ring */}
          <Animated.View style={[styles.glowRing, { borderColor: accentColor, opacity: glowOpacity }]} />
          <View style={[styles.logoCircle, { borderColor: accentColor, backgroundColor: `${accentColor}15` }]}>
            <Film size={44} color={accentColor} />
          </View>
          <Text style={styles.appName}>FabPrime</Text>
          <Text style={styles.tagline}>Movies · Series · Anime</Text>
        </Animated.View>

        {/* ── Features row ──────────────────────────────── */}
        <Animated.View style={[styles.featuresRow, { transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}>
          <FeaturePill icon={Cloud} label="Cloud Sync" color={accentColor} />
          <FeaturePill icon={Shield} label="Secure" color={accentColor} />
          <FeaturePill icon={Star} label="Personalized" color={accentColor} />
        </Animated.View>

        {/* ── Card ──────────────────────────────────────── */}
        <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}>
          <LinearGradient
            colors={["#FFFFFF08", "#FFFFFF03"]}
            style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
          />

          <Text style={styles.cardTitle}>Welcome</Text>
          <Text style={styles.cardSubtitle}>
            Sign in to sync your watchlist, favorites, and history across all your devices.
          </Text>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleSignIn}
            disabled={isGoogleLoading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#FFFFFF", "#F0F0F0"]}
              style={styles.googleBtnGradient}
            >
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color="#4285F4" />
              ) : (
                <>
                  {/* Official Google G logo colors */}
                  <View style={styles.googleLogo}>
                    <Text style={styles.googleLogoText}>G</Text>
                  </View>
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Guest Button */}
          <TouchableOpacity
            style={[styles.guestBtn, { borderColor: "rgba(255,255,255,0.15)" }]}
            onPress={handleGuest}
            disabled={isGuestLoading}
            activeOpacity={0.8}
          >
            {isGuestLoading ? (
              <ActivityIndicator size="small" color={accentColor} />
            ) : (
              <>
                <UserRound size={18} color={accentColor} style={{ marginRight: 10 }} />
                <Text style={[styles.guestBtnText, { color: accentColor }]}>Continue as Guest</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Guest mode saves data on this device only.{"\n"}Sign in with Google to sync across devices.
          </Text>
        </Animated.View>
      </Animated.View>
    </Container>
  )
}

function FeaturePill({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <View style={[styles.featurePill, { borderColor: `${color}30`, backgroundColor: `${color}10` }]}>
      <Icon size={13} color={color} />
      <Text style={[styles.featurePillText, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center" },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24, gap: 24 },

  // Decorative blobs
  blob1: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    top: -width * 0.3,
    left: -width * 0.2,
  },
  blob2: {
    position: "absolute",
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: "#3B00FF20",
    bottom: -width * 0.2,
    right: -width * 0.1,
  },

  // Logo
  logoSection: { alignItems: "center", gap: 8 },
  glowRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    top: -10,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 32,
    fontFamily: "ClashGrotesk-Bold",
    color: "#FFFFFF",
    marginTop: 12,
  },
  tagline: {
    fontSize: 13,
    fontFamily: "GeneralSans-Medium",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // Features
  featuresRow: { flexDirection: "row", justifyContent: "center", gap: 8 },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  featurePillText: { fontSize: 11, fontFamily: "GeneralSans-Semibold" },

  // Card
  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 24,
    gap: 16,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "GeneralSans-Bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: "GeneralSans-Regular",
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 20,
  },

  // Google Button
  googleBtn: { borderRadius: 16, overflow: "hidden" },
  googleBtnGradient: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    gap: 12,
  },
  googleLogo: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
  },
  googleLogoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "GeneralSans-Bold",
  },
  googleBtnText: {
    color: "#1A1A1A",
    fontSize: 15,
    fontFamily: "GeneralSans-Bold",
  },

  // Divider
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: "rgba(255,255,255,0.15)" },
  dividerText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
  },

  // Guest Button
  guestBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  guestBtnText: { fontSize: 14, fontFamily: "GeneralSans-Bold" },

  // Disclaimer
  disclaimer: {
    fontSize: 11,
    color: "rgba(255,255,255,0.25)",
    fontFamily: "GeneralSans-Regular",
    textAlign: "center",
    lineHeight: 17,
  },
})
