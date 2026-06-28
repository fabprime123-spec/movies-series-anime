import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Animated, Pressable, StyleSheet, View } from "react-native"
import { Search, Bookmark } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import { useEffect, useRef, useState } from "react"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"

// Custom 2x2 Grid Icon: top-right is a circle, others are squares (balanced and sized correctly)
function CustomGridIcon({ size, color, fill = "#ff00ff00" }: { size: number; color: string, fill?: string }) {
  const gridBoxSize = size * 0.85 // Balanced ~18px box within 28px container
  const itemSize = (gridBoxSize - 1.5) / 2
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: gridBoxSize,
          height: gridBoxSize,
          justifyContent: "space-between",
          flexWrap: "wrap",
          flexDirection: "row",
          alignContent: "space-between",
        }}
      >
        {/* Top Left: Square */}
        <View style={{ backgroundColor: fill, width: itemSize, height: itemSize, borderWidth: 1.8, borderColor: color, borderRadius: 2 }} />
        {/* Top Right: Circle */}
        <View style={{ backgroundColor: fill, width: itemSize, height: itemSize, borderWidth: 1.8, borderColor: color, borderRadius: itemSize / 2 }} />
        {/* Bottom Left: Square */}
        <View style={{ backgroundColor: fill, width: itemSize, height: itemSize, borderWidth: 1.8, borderColor: color, borderRadius: 2 }} />
        {/* Bottom Right: Square */}
        <View style={{ backgroundColor: fill, width: itemSize, height: itemSize, borderWidth: 1.8, borderColor: color, borderRadius: 2 }} />
      </View>
    </View>
  )
}

// Custom User Icon: balanced head, body, and exact baseline shoulders
function CustomUserIcon({ size, color, fill = "#ff00ff00" }: { size: number; color: string, fill?: string }) {
  const headSize = size * 0.43 // Balanced head size
  const bodyWidth = size * 0.9 // Stretched wide body / shoulders
  const bodyHeight = size * 0.35
  const lineWidth = bodyWidth // Baseline matches shoulder width exactly

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Head */}
      <View
        style={{
          width: headSize,
          height: headSize,
          borderRadius: headSize / 2,
          borderWidth: 1.8,
          borderColor: color,
          marginBottom: 2,
          backgroundColor: fill
        }}
      />
      {/* Body / Shoulders */}
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          borderWidth: 1.8,
          borderColor: color,
          borderTopLeftRadius: bodyWidth * 0.4, // smooth wide shoulders curvature
          borderTopRightRadius: bodyWidth * 0.4,
          borderBottomWidth: 0,
          backgroundColor: fill
        }}
      />
      {/* Horizontal Baseline */}
      <View
        style={{
          width: lineWidth,
          height: 1.8,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  )
}

const icons = {
  Home: CustomGridIcon,
  Search: Search,
  Library: Bookmark,
  Profile: CustomUserIcon
} as const

interface TabButtonProps {
  Icon: any
  focused: boolean
  accentColor: string
  theme: any
  onPress: () => void
}

function TabButton({ Icon, focused, accentColor, theme, onPress }: TabButtonProps) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0)).current

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      tension: 45,
      friction: 8,
    }).start()
  }, [focused])

  const bubbleScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  })

  const iconScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  })

  return (
    <Pressable onPress={onPress} style={styles.button}>
      {/* Soft Glow Bubble Background */}
      <Animated.View
        style={[
          styles.bubble,
          {
            backgroundColor: `${accentColor}1E`, // ~12% opacity glow
            transform: [{ scale: bubbleScale }],
            opacity: scaleAnim,
          }
        ]}
      />
      {/* Icon with Drop/Glow Shadow */}
      <Animated.View
        style={[
          { transform: [{ scale: iconScale }] },
          focused
            ? {
              shadowColor: accentColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 8,
              elevation: 4,
            }
            : {
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.35,
              shadowRadius: 3,
              elevation: 2,
            }
        ]}
      >
        <Icon
          size={28}
          strokeWidth={focused ? 2 : 2}
          color={focused ? accentColor : theme.muted}
        />
      </Animated.View>
      {/* Active Indicator Dot */}
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: accentColor,
            transform: [{ scale: scaleAnim }],
            opacity: scaleAnim,
          }
        ]}
      />
    </Pressable>
  )
}

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { theme, mode, accentColor, blurTarget } = useTheme()
  const [blurKey, setBlurKey] = useState(0)

  // Force remount when the screen changes to bind the new BlurTargetView correctly
  useEffect(() => {
    if (blurTarget && blurTarget.current) {
      const timer = setTimeout(() => {
        setBlurKey(prev => prev + 1)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [blurTarget, blurTarget?.current])

  const activeBlurMethod = (blurTarget && blurTarget.current) ? "dimezisBlurView" : "none"

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Top blur gradient to soften the transition from lists to tab bar */}
      <LinearGradient
        colors={["transparent", theme.background + "cc", theme.background]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View
        style={[
          styles.shadowWrapper,
          {
            shadowColor: theme.background === "#000000" ? "#000" : "#999",
          }
        ]}
      >
        <BlurView
          key={`blur-view-${blurKey}`}
          intensity={mode === "dark" ? 60 : 85}
          tint={mode === "dark" ? "dark" : "light"}
          blurMethod={activeBlurMethod}
          blurTarget={blurTarget}
          style={[
            styles.innerContainer,
            {
              borderColor: theme.border,
              backgroundColor: mode === "dark" ? "rgba(0, 0, 0, 0.75)" : "rgba(255, 255, 255, 0.85)"
            }
          ]}
        >
          {state.routes.map((route, index) => {
            const focused = state.index === index
            const Icon = icons[route.name as keyof typeof icons]

            return (
              <TabButton
                key={route.key}
                Icon={Icon}
                focused={focused}
                accentColor={accentColor}
                theme={theme}
                onPress={() => navigation.navigate(route.name)}
              />
            )
          })}
        </BlurView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 22, // Space from bottom edge of screen
  },
  shadowWrapper: {
    width: "95%",
    height: 70,
    borderRadius: 29,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  innerContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    overflow: "hidden",
    paddingBottom: 5,
  },
  button: {
    width: 58,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bubble: {
    position: "absolute",
    top: 3, // (44 - 36) / 2 = 4 (vertically centered inside button)
    left: 4, // (58 - 48) / 2 = 5 (horizontally centered inside button)
    width: 50,
    height: 40,
    borderRadius: 18,
  },
  dot: {
    position: "absolute",
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
  }
})