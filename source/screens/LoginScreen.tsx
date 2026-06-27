import React, { useState } from "react"
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { Film, Mail, Lock, LogIn, UserRound } from "lucide-react-native"

export function LoginScreen() {
  const { theme, accentColor } = useTheme()
  const { loginAsGuest } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isGuestLoading, setIsGuestLoading] = useState(false)

  const handleGuestSignIn = async () => {
    try {
      setIsGuestLoading(true)
      // Simulate network request delay for premium feel
      await new Promise((resolve) => setTimeout(resolve, 800))
      await loginAsGuest()
    } catch (error) {
      console.error(error)
    } finally {
      setIsGuestLoading(false)
    }
  }

  const handleEmailSignIn = () => {
    if (!email || !password) {
      Alert.alert("Input Needed", "Please enter both email and password.")
      return
    }
    // Simulate standard mock email signin using Guest session
    handleGuestSignIn()
  }

  return (
    <Container style={styles.container}>
      <LinearGradient
        colors={["#000000", "#080010", "#140026", "#04000d", "#000000"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={[styles.logoCircle, { backgroundColor: `${accentColor}18`, borderColor: accentColor }]}>
              <Film size={40} color={accentColor} />
            </View>
            <Text style={styles.appName}>FabPrime</Text>
            <Text style={[styles.appTagline, { color: theme.muted }]}>
              Your ultimate movie & anime playground
            </Text>
          </View>

          {/* Login Card (Glassmorphic) */}
          <View style={styles.cardContainer}>
            <BlurView intensity={50} tint="dark" style={[styles.blurCard, { borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.foreground }]}>Welcome Back</Text>
              
              {/* Email Form */}
              <View style={styles.inputGroup}>
                <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Mail size={18} color={theme.muted} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Email Address"
                    placeholderTextColor={theme.muted}
                    value={email}
                    onChangeText={setEmail}
                    style={[styles.input, { color: theme.foreground }]}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Lock size={18} color={theme.muted} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={theme.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={[styles.input, { color: theme.foreground }]}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: accentColor }]}
                onPress={handleEmailSignIn}
                activeOpacity={0.8}
              >
                <LogIn size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>Sign In</Text>
              </TouchableOpacity>

              {/* Guest Bypass Button */}
              <TouchableOpacity
                style={[styles.guestBtn, { borderColor: theme.border }]}
                onPress={handleGuestSignIn}
                disabled={isGuestLoading}
                activeOpacity={0.8}
              >
                {isGuestLoading ? (
                  <ActivityIndicator size="small" color={accentColor} />
                ) : (
                  <>
                    <UserRound size={18} color={accentColor} style={{ marginRight: 8 }} />
                    <Text style={[styles.guestBtnText, { color: accentColor }]}>Continue as Guest</Text>
                  </>
                )}
              </TouchableOpacity>

            </BlurView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontFamily: "ClashGrotesk-Bold",
    color: "#FFFFFF",
  },
  appTagline: {
    fontSize: 14,
    fontFamily: "GeneralSans-Medium",
    marginTop: 4,
    textAlign: "center",
  },
  cardContainer: {
    borderRadius: 24,
    overflow: "hidden",
  },
  blurCard: {
    padding: 24,
    borderWidth: 1,
    borderRadius: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: "GeneralSans-Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    gap: 12,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    fontFamily: "GeneralSans-Medium",
  },
  primaryBtn: {
    flexDirection: "row",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "GeneralSans-Bold",
  },
  guestBtn: {
    flexDirection: "row",
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 12,
  },
  guestBtnText: {
    fontSize: 14,
    fontFamily: "GeneralSans-Bold",
  }
})
