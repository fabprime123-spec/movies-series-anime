import React, { useState } from "react"
import { StyleSheet, View, Switch, ScrollView, TouchableOpacity } from "react-native"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useTheme } from "../theme/ThemeContext"
import { accents } from "../constants/accents"
import { useNavigation } from "@react-navigation/native"
import { useSettings } from "../store/SettingsContext"
import { useHistory } from "../store/HistoryContext"
import { useSearchHistory } from "../store/SearchHistoryContext"
import { NativeGradient } from '../components/native/NativeGradient'
import { Moon, Sun, Palette, ChevronRight, Monitor, Trash, History, Search, ChevronLeft, Image as ImageIcon, Check, Globe } from "lucide-react-native"
import { CustomAlert } from "../components/ui/CustomAlert"
import { SearchableSelectionModal } from "../components/ui/SearchableSelectionModal"
import { COUNTRIES } from "../constants/countries"

export function SettingsScreen() {
  const { mode, changeMode, accentColor, changeAccent, theme, galleryViewMode, setGalleryViewMode } = useTheme()
  const navigation = useNavigation()
  const {
    videoQuality,
    excludedCountries,
    updateSetting,
    clearSettings,
  } = useSettings()

  const { clearSearches } = useSearchHistory()
  const { clearHistory } = useHistory()

  const accentList = Object.entries(accents)

  const [clearSearchVisible, setClearSearchVisible] = useState(false)
  const [clearHistoryVisible, setClearHistoryVisible] = useState(false)
  const [clearSettingsVisible, setClearSettingsVisible] = useState(false)
  const [countriesModalVisible, setCountriesModalVisible] = useState(false)

  const toggleCountryExclusion = (code: string) => {
    if (excludedCountries.includes(code)) {
      updateSetting('excludedCountries', excludedCountries.filter(c => c !== code))
    } else {
      updateSetting('excludedCountries', [...excludedCountries, code])
    }
  }

  return (
    <>
      <Container>
        <View style={styles.header}>
          <NativeGradient
            colors={[theme.background, `${theme.background}E6`, "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: theme.card }]} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <ChevronLeft size={20} color={theme.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Content Settings Section */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Content Settings</Text>

            <TouchableOpacity style={styles.settingRow} onPress={() => setCountriesModalVisible(true)} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Globe size={18} color="#FF6B6B" /></View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Country Exclusions</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]} ellipsizeMode="tail">
                    {excludedCountries.length === 0 ? "None excluded" : `${excludedCountries.length} excluded (e.g. ${excludedCountries.join(", ")})`}
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>
          </View>

          {/* General Preferences */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>General Preferences</Text>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>{mode === "dark" ? <Moon size={18} color={accentColor} /> : <Sun size={18} color={accentColor} />}</View>
                <Text style={styles.rowTitle}>Dark Mode</Text>
              </View>
              <Switch value={mode === "dark"} onValueChange={changeMode} thumbColor={mode === "dark" ? accentColor : "#f4f3f4"} trackColor={{ false: "#767577", true: `${accentColor}80` }} />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={[styles.row, { flexDirection: "column", alignItems: "flex-start", gap: 10 }]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><ImageIcon size={18} color={accentColor} /></View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Gallery View Mode</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>Direction for viewing many images</Text>
                </View>
              </View>
              <View style={styles.qualityContainer}>
                {(["horizontal", "vertical"] as const).map((gMode) => {
                  const isSelected = galleryViewMode === gMode
                  return (
                    <TouchableOpacity key={gMode} onPress={() => setGalleryViewMode(gMode)} style={[styles.qualityBtn, { backgroundColor: isSelected ? accentColor : theme.surface, borderColor: isSelected ? accentColor : theme.border }]}>
                      <Text style={[styles.qualityText, { color: isSelected ? "#FFF" : theme.foreground, fontFamily: isSelected ? "GeneralSans-Bold" : "GeneralSans-Medium", textTransform: 'capitalize' }]}>{gMode}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={[styles.row, { flexDirection: "column", alignItems: "flex-start", gap: 10 }]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Monitor size={18} color={accentColor} /></View>
                <Text style={styles.rowTitle}>Streaming Resolution</Text>
              </View>
              <View style={styles.qualityContainer}>
                {(["SD", "HD", "4K"] as const).map((q) => {
                  const isSelected = videoQuality === q
                  return (
                    <TouchableOpacity key={q} onPress={() => updateSetting('videoQuality', q)} style={[styles.qualityBtn, { backgroundColor: isSelected ? accentColor : theme.surface, borderColor: isSelected ? accentColor : theme.border }]}>
                      <Text style={[styles.qualityText, { color: isSelected ? "#FFF" : theme.foreground, fontFamily: isSelected ? "GeneralSans-Bold" : "GeneralSans-Medium" }]}>{q === "SD" ? "SD" : q === "HD" ? "HD" : "4K Ultra"}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>

          {/* Appearance */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border, padding: 0, paddingVertical: 16 }]}>
            <Text style={[styles.sectionTitle, { color: accentColor, paddingHorizontal: 16 }]}>Appearance</Text>
            <View style={[styles.row, { flexDirection: "column", alignItems: "flex-start", gap: 10 }]}>
              <NativeGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[theme.card, theme.card, "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.card, theme.card]}
                style={[{
                  position: "absolute", bottom: 0, height: 30, borderWidth: 1,
                  borderColor: '#fff', width: "100%", zIndex: 20
                }]}
              />
              <View style={[styles.rowLeft, { paddingHorizontal: 16 }]}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Palette size={18} color={accentColor} /></View>
                <Text style={styles.rowTitle}>Theme Accent Color</Text>
              </View>
              <ScrollView contentContainerStyle={[styles.colorsRow, { paddingHorizontal: 16 }]} horizontal showsHorizontalScrollIndicator={false}>
                {accentList.map(([key, value]) => {
                  const valStr = value as string;
                  const isSelected = accentColor === valStr
                  return (
                    <TouchableOpacity key={key} onPress={() => changeAccent(valStr)} style={[styles.colorDot, { backgroundColor: valStr }, isSelected && { borderColor: theme.foreground, borderWidth: 2 }]} activeOpacity={0.8}>
                      {isSelected && <Check size={12} color={theme.foreground} strokeWidth={3} />}
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
          </View>

          {/* Storage & Data Section */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Storage & Data</Text>

            <TouchableOpacity style={styles.row} onPress={() => setClearHistoryVisible(true)} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><History size={18} color="#FF6B6B" /></View>
                <Text style={[styles.rowTitle, { color: "#FF6B6B", marginLeft: 4 }]}>Clear View History</Text>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <TouchableOpacity style={styles.row} onPress={() => setClearSearchVisible(true)} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Search size={18} color="#FF6B6B" /></View>
                <Text style={[styles.rowTitle, { color: "#FF6B6B", marginLeft: 4 }]}>Clear Search History</Text>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <TouchableOpacity style={styles.row} onPress={() => setClearSettingsVisible(true)} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Trash size={18} color="#FF6B6B" /></View>
                <Text style={[styles.rowTitle, { color: "#FF6B6B", marginLeft: 4 }]}>Reset All Settings</Text>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <NativeGradient
          colors={["transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      </Container>

      <SearchableSelectionModal
        visible={countriesModalVisible} onClose={() => setCountriesModalVisible(false)} title="Country Exclusions"
        data={COUNTRIES} selectedValue={excludedCountries}
        onSelect={(countryCode: string) => toggleCountryExclusion(countryCode)}
        isCountry theme={theme} accentColor={accentColor}
      />

      <CustomAlert
        visible={clearHistoryVisible}
        onClose={() => setClearHistoryVisible(false)}
        title="Clear History"
        message="Are you sure you want to clear your recently viewed history?"
        buttons={[
          { text: "Cancel", style: "cancel" },
          { text: "Clear", style: "destructive", onPress: () => clearHistory() }
        ]}
      />

      <CustomAlert
        visible={clearSearchVisible}
        onClose={() => setClearSearchVisible(false)}
        title="Clear Searches"
        message="Are you sure you want to clear your search history?"
        buttons={[
          { text: "Cancel", style: "cancel" },
          { text: "Clear", style: "destructive", onPress: () => clearSearches() }
        ]}
      />

      <CustomAlert
        visible={clearSettingsVisible}
        onClose={() => setClearSettingsVisible(false)}
        title="Reset Settings"
        message="Are you sure you want to reset all settings to their default values?"
        buttons={[
          { text: "Cancel", style: "cancel" },
          { text: "Reset", style: "destructive", onPress: () => clearSettings() }
        ]}
      />
    </>
  )
}

const styles = StyleSheet.create({
  header: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, height: 60, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16 },
  headerTitle: { fontSize: 20, fontFamily: "GeneralSans-Bold" },
  headerBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingHorizontal: 16, paddingTop: 68, paddingBottom: 50, gap: 16 },
  section: { borderRadius: 20, borderWidth: 1, padding: 16, gap: 14 },
  sectionTitle: { fontSize: 12, fontFamily: "GeneralSans-Bold", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 2 },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  rowCopy: { flex: 1 },
  rowTitle: { fontSize: 15, fontFamily: "GeneralSans-Semibold" },
  rowSubtitle: { fontSize: 12, fontFamily: "GeneralSans-Medium", marginTop: 1 },
  divider: { height: 0.5, width: "100%" },
  qualityContainer: { flexDirection: "row", gap: 8, width: "100%", paddingTop: 4 },
  qualityBtn: { flex: 1, height: 36, borderRadius: 10, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  qualityText: { fontSize: 12 },
  colorsRow: { gap: 12, paddingTop: 4 },
  colorDot: { width: 28, height: 28, borderRadius: 14, justifyContent: "center", alignItems: "center" },
})
