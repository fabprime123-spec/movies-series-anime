import React, { useState, useEffect, useRef } from "react"
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions, TextInput, FlatList, Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "./Text"
import { NativeGradient } from "../native/NativeGradient"
import { X, Check } from "lucide-react-native"

export function SearchableSelectionModal({
  visible, onClose, title, data, selectedValue, onSelect, isCountry = false, theme, accentColor
}: any) {
  const [search, setSearch] = useState("")
  const [renderOverlay, setRenderOverlay] = useState(visible)
  const slideAnim = useRef(new Animated.Value(Dimensions.get("screen").height)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const insets = useSafeAreaInsets()
  const screenH = Dimensions.get("screen").height
  const windowH = Dimensions.get("window").height
  const navBarH = Math.max(screenH - windowH, insets.bottom, 0)
  const bottomOffset = navBarH + 20

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

  const filtered = data.filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase()))

  if (!renderOverlay) return null

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 9999, backgroundColor: "rgba(0,0,0,0.65)", opacity: opacityAnim, justifyContent: "flex-end" }]}>
      <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border, bottom: 0, paddingBottom: Math.max(bottomOffset, 32) * 0, position: "absolute", left: 0, right: 0, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.surface }]}><X size={16} color={theme.foreground} /></TouchableOpacity>
        </View>
        <TextInput placeholder="Search alphabetically..." placeholderTextColor={theme.muted} value={search} onChangeText={setSearch} style={[styles.searchInput, { backgroundColor: theme.surface, color: theme.foreground, borderColor: theme.border }]} />
        <FlatList
          data={filtered}
          keyExtractor={(item: any) => item.code}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          showsVerticalScrollIndicator={true}
          indicatorStyle={"black"}
          renderItem={({ item }: any) => {
            const isSelected = Array.isArray(selectedValue) ? selectedValue.includes(item.code) : selectedValue === item.name || selectedValue === item.code
            return (
              <TouchableOpacity onPress={() => onSelect(item.code)} style={[styles.modalItem, { borderBottomColor: theme.border }]} activeOpacity={0.7}>
                <View style={styles.modalItemLeft}>
                  {isCountry ? (
                    <Image source={{ uri: `https://flagcdn.com/w80/${item.code.toLowerCase()}.png` }} style={styles.flagRect} />
                  ) : (
                    <View style={[styles.langBubble, { backgroundColor: theme.surface }]}><Text style={{ color: theme.muted, fontSize: 10, fontFamily: "GeneralSans-Bold" }}>{item.code.toUpperCase()}</Text></View>
                  )}
                  <Text style={[styles.modalItemText, { color: theme.foreground }]}>{item.name}</Text>
                </View>
                {isSelected && <View style={[styles.indicatorCheck, { backgroundColor: accentColor }]}><Check size={10} color="#FFFFFF" strokeWidth={3} /></View>}
              </TouchableOpacity>
            )
          }}
          windowSize={4}
          initialNumToRender={10}
        />
        <NativeGradient
          colors={["transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
          pointerEvents="none"
        />
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  gradient: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" },
  modalContent: { height: "80%", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderBottomWidth: 0, padding: 20, paddingBottom: 0, gap: 16 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: 18, fontFamily: "GeneralSans-Bold" },
  closeBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  searchInput: { height: 44, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontFamily: "GeneralSans-Medium", fontSize: 14 },
  modalItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 0.5 },
  modalItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  flagRect: { width: 24, height: 16, borderRadius: 2, resizeMode: "cover", marginRight: 14, borderWidth: 1 },
  langBubble: { width: 28, height: 18, borderRadius: 4, justifyContent: "center", alignItems: "center", marginRight: 14 },
  modalItemText: { fontSize: 15, fontFamily: "GeneralSans-Semibold" },
  indicatorCheck: { width: 16, height: 16, borderRadius: 8, justifyContent: "center", alignItems: "center" }
})
