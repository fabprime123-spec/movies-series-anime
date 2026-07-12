import React, { useState, useEffect, useRef } from "react"
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions, Modal } from "react-native"
import { Text } from "./Text"
import { useTheme } from "../../theme/ThemeContext"

export interface CustomAlertButton {
  text: string
  style?: "cancel" | "destructive" | "default"
  onPress?: () => void
}

interface CustomAlertProps {
  visible: boolean
  title: string
  message: string
  buttons: CustomAlertButton[]
  onClose: () => void
}

export function CustomAlert({ visible, title, message, buttons, onClose }: CustomAlertProps) {
  const { theme, accentColor } = useTheme()
  const [renderOverlay, setRenderOverlay] = useState(visible)
  const slideAnim = useRef(new Animated.Value(Dimensions.get("screen").height)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      setRenderOverlay(true)
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true })
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: Dimensions.get("screen").height, duration: 200, useNativeDriver: true })
      ]).start(() => setRenderOverlay(false))
    }
  }, [visible])

  if (!renderOverlay) return null

  return (
    <Modal visible={renderOverlay} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 99999, backgroundColor: "rgba(0,0,0,0.65)", opacity: opacityAnim, justifyContent: "flex-end" }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <Animated.View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border, transform: [{ translateY: slideAnim }], zIndex: 99999 }]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.message, { color: theme.muted }]}>{message}</Text>
          <View style={styles.btnRow}>
            {buttons.map((btn, idx) => {
              const isDestructive = btn.style === "destructive"
              const isCancel = btn.style === "cancel"
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.btn,
                    {
                      backgroundColor: isDestructive ? "#FF6B6B" : isCancel ? theme.surface : accentColor,
                      borderColor: theme.border,
                      borderWidth: isCancel ? 1 : 0
                    }
                  ]}
                  onPress={() => {
                    if (btn.onPress) btn.onPress()
                    onClose()
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: isCancel ? theme.foreground : "#FFF", fontFamily: "GeneralSans-Bold" }}>{btn.text}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 24,
    paddingBottom: 40,
    gap: 16
  },
  title: {
    fontSize: 20,
    fontFamily: "GeneralSans-Bold",
    textAlign: "center"
  },
  message: {
    fontSize: 15,
    fontFamily: "GeneralSans-Medium",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8
  },
  btnRow: {
    flexDirection: "row",
    gap: 12
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center"
  }
})
