import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../../context/ThemeContext"
import { StyleSheet, ViewProps } from "react-native"
import { BlurTargetView } from "expo-blur"
import { useRef, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"

interface ContainerProps extends ViewProps {
  children: React.ReactNode
}

export function Container({ children, style, ...props }: ContainerProps) {
  const { theme, setBlurTarget } = useTheme()
  const targetRef = useRef(null)

  useFocusEffect(
    useCallback(() => {
      if (targetRef.current) {
        setBlurTarget(targetRef)
      }
      return () => setBlurTarget(null)
    }, [targetRef])
  )

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <BlurTargetView
        ref={targetRef}
        {...props}
        style={[styles.container, { backgroundColor: theme.background }, style]}
      >
        {children}
      </BlurTargetView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1
  }
})