import React from 'react'
import { BlurView } from "@react-native-community/blur"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { StyleSheet, View, TouchableOpacity } from "react-native"
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect, Mask } from 'react-native-svg'
import { Search, LayoutGrid, Bookmark, UserRound } from "lucide-react-native"
import { useTheme } from '../theme/ThemeContext'
import LinearGradient from 'react-native-linear-gradient'

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme, accentColor } = useTheme()

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Absolute overlay for the background gradient with a hole cut out for the BlurView */}
      <View style={[StyleSheet.absoluteFill]} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <SvgLinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="transparent" stopOpacity="0" />
              <Stop offset="0.4" stopColor={theme.background + "20"} />
              <Stop offset="1" stopColor={theme.background} stopOpacity="1" />
            </SvgLinearGradient>
            <Mask id="mask">
              {/* White area keeps the gradient */}
              <Rect width="100%" height="100%" fill="white" />
              {/* Black area removes the gradient (creates the hole for the blur view) */}
              {/* x=2.5% because width is 95%, y=8 because height is 70 and total height is 100 with bottom padding 22 */}
              <Rect x="2.5%" y="15" width="94%" height="67" rx="15" fill="black" />
            </Mask>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" mask="url(#mask)" />
        </Svg>
      </View>

      <View style={[styles.shadowWrapper, { boxShadow: `0px 0px 1px ${theme.muted}, inset 0px 0px 1px ${theme.muted}` }]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          key={"blur-tab-bar"}
          blurAmount={5}
          blurRadius={5}
          reducedTransparencyFallbackColor="transparent"
          overlayColor="transparent"
        />
        <LinearGradient style={StyleSheet.absoluteFill} colors={["transparent", theme.background + "11"]} />
        <View style={[styles.innerContainer, { borderColor: theme.muted + "30" }]}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key]
            const isFocused = state.index === index

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }

            let IconComponent = LayoutGrid
            if (route.name === 'Search') IconComponent = Search
            else if (route.name === 'Library') IconComponent = Bookmark
            else if (route.name === 'Profile') IconComponent = UserRound

            const color = isFocused ? accentColor : theme.foreground

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                style={styles.tabButton}
              >
                {isFocused && (
                  <>
                    <View style={[styles.backgroundIndicator, { backgroundColor: accentColor + "11" }]} />
                    <View style={[styles.activeIndicator, { backgroundColor: accentColor, shadowColor: accentColor }]} />
                  </>
                )}
                <IconComponent color={color} size={32} strokeWidth={isFocused ? 2 : 1.5} />
              </TouchableOpacity>
            )
          })}
        </View>
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
    paddingBottom: 16,
  },
  shadowWrapper: {
    width: "96%",
    height: 70,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 0.1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  innerContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between", // Ensure icons are spaced properly
    paddingHorizontal: 8,
    paddingBottom: 4,
    borderRadius: 20,
    borderWidth: 0.1,
  },
  gradient: {
    position: "absolute",
    width: "100%",
    height: "50%",
    bottom: 0
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  backgroundIndicator: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 8,
    borderRadius: 20,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 12,
    width: 4,
    height: 4,
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  }
})