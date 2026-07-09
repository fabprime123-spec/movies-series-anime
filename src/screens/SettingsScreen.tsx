import React, { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  View,
  Switch,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Animated,
  Alert
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useTheme } from "../theme/ThemeContext"
import { accents } from "../constants/accents"
import { useNavigation } from "@react-navigation/native"
import { useSettings } from "../store/SettingsContext"
import { useHistory } from "../store/HistoryContext"
import { useSearchHistory } from "../store/SearchHistoryContext"
import LinearGradient from 'react-native-linear-gradient'
import {
  ArrowLeft,
  Moon,
  Sun,
  Palette,
  Play,
  Wifi,
  Bell,
  Monitor,
  Globe,
  Check,
  ChevronRight,
  Languages,
  Filter,
  Film,
  Calendar,
  X,
  Trash,
  Captions,
  ShieldCheck,
  Zap,
  Vibrate,
  History,
  Search,
  ChevronLeft
} from "lucide-react-native"

const languagesList = [
  { code: "ar", name: "Arabic" }, { code: "bn", name: "Bengali" }, { code: "zh", name: "Chinese" },
  { code: "en", name: "English" }, { code: "fr", name: "French" }, { code: "de", name: "German" },
  { code: "hi", name: "Hindi" }, { code: "it", name: "Italian" }, { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" }, { code: "ru", name: "Russian" }, { code: "es", name: "Spanish" },
]

const countriesList = [
  { code: "US", name: "United States" }, { code: "GB", name: "United Kingdom" }, { code: "KR", name: "South Korea" },
  { code: "JP", name: "Japan" }, { code: "IN", name: "India" }, { code: "FR", name: "France" },
  { code: "ES", name: "Spain" }, { code: "IT", name: "Italy" }, { code: "DE", name: "Germany" },
  { code: "CN", name: "China" }, { code: "RU", name: "Russia" }, { code: "BR", name: "Brazil" },
]

const platformList = [
  { id: "netflix", name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Netflix-new-icon.png" },
  { id: "disney", name: "Disney+", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/320px-Disney%2B_logo.svg.png" },
  { id: "prime", name: "Prime Video", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/320px-Amazon_Prime_Video_logo.svg.png" },
  { id: "apple", name: "Apple TV+", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Apple_TV_Logo_2019.svg/320px-Apple_TV_Logo_2019.svg.png" }
]

export function SettingsScreen() {
  const { mode, changeMode, accentColor, changeAccent, theme } = useTheme()
  const navigation = useNavigation()

  const {
    appLanguage,
    audioLanguage,
    excludedCountries,
    autoplayTrailers,
    wifiOnly,
    notifications,
    videoQuality,
    filterLanguage,
    selectedPlatforms,
    filterYear,
    subtitleSize,
    maturityRating,
    dataSaver,
    hapticFeedback,
    updateSetting,
    clearSettings,
  } = useSettings()

  const { clearSearches } = useSearchHistory()
  const { clearHistory } = useHistory()

  const [appLanguageModal, setAppLanguageModal] = useState(false)
  const [audioLanguageModal, setAudioLanguageModal] = useState(false)
  const [countriesModal, setCountriesModal] = useState(false)

  const accentList = Object.entries(accents)

  const togglePlatformSelection = (id: string) => {
    if (selectedPlatforms.includes(id)) {
      updateSetting('selectedPlatforms', selectedPlatforms.filter(p => p !== id))
    } else {
      updateSetting('selectedPlatforms', [...selectedPlatforms, id])
    }
  }

  const toggleCountryExclusion = (code: string) => {
    if (excludedCountries.includes(code)) {
      updateSetting('excludedCountries', excludedCountries.filter(c => c !== code))
    } else {
      updateSetting('excludedCountries', [...excludedCountries, code])
    }
  }

  const handleClearSearches = () => {
    Alert.alert("Clear Searches", "Are you sure you want to clear your search history?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => clearSearches() }
    ]);
  };

  const handleClearHistory = () => {
    Alert.alert("Clear History", "Are you sure you want to clear your recently viewed history?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => clearHistory() }
    ]);
  };

  return (
    <>
      <Container>
        <View style={styles.header}>
          <LinearGradient colors={[theme.background, `${theme.background}E6`, "transparent"]} style={StyleSheet.absoluteFill} />
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

            <TouchableOpacity style={styles.settingRow} onPress={() => setAppLanguageModal(true)} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Languages size={18} color={accentColor} /></View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>App Language</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>{appLanguage}</Text>
                </View>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <TouchableOpacity style={styles.settingRow} onPress={() => setAudioLanguageModal(true)} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Globe size={18} color={accentColor} /></View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Audio & Subtitles</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>{audioLanguage}</Text>
                </View>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <TouchableOpacity style={styles.settingRow} onPress={() => setCountriesModal(true)} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Globe size={18} color="#FF6B6B" /></View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Country Exclusions</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>
                    {excludedCountries.length === 0 ? "None excluded" : `${excludedCountries.length} excluded (e.g. ${excludedCountries[0]})`}
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>
          </View>

          {/* Advanced Content Filters */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Playback & Feed Filters</Text>

            <View style={styles.filterSection}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Film size={18} color={accentColor} /></View>
                <Text style={styles.rowTitle}>Streaming Providers</Text>
              </View>
              <View style={styles.platformsGrid}>
                {platformList.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id)
                  return (
                    <TouchableOpacity
                      key={platform.id} onPress={() => togglePlatformSelection(platform.id)}
                      style={[styles.platformCard, { backgroundColor: isSelected ? `${accentColor}1A` : theme.surface, borderColor: isSelected ? accentColor : theme.border }]}
                      activeOpacity={0.72}
                    >
                      <Image source={{ uri: platform.logo }} style={styles.platformLogo} />
                      <Text style={[styles.platformName, isSelected && { color: accentColor }]}>{platform.name}</Text>
                      {isSelected && <View style={[styles.selectIndicator, { backgroundColor: accentColor }]}><Check size={8} color="#FFFFFF" strokeWidth={3} /></View>}
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.filterSection}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Calendar size={18} color={accentColor} /></View>
                <Text style={styles.rowTitle}>Year Filter</Text>
              </View>
              <View style={styles.chipRow}>
                {["All", "2024", "2023", "2022", "2020+", "2010+"].map((year) => {
                  const isSelected = filterYear === year
                  return (
                    <TouchableOpacity key={year} onPress={() => updateSetting('filterYear', year)} style={[styles.filterChip, { backgroundColor: isSelected ? accentColor : theme.surface, borderColor: isSelected ? accentColor : theme.border }]}>
                      <Text style={[styles.chipText, { color: isSelected ? "#FFF" : theme.foreground }]}>{year}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.filterSection}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Filter size={18} color={accentColor} /></View>
                <Text style={styles.rowTitle}>Original Language</Text>
              </View>
              <View style={styles.chipRow}>
                {[{ code: "All", name: "All" }, { code: "en", name: "English" }, { code: "hi", name: "Hindi" }, { code: "es", name: "Spanish" }, { code: "ko", name: "Korean" }, { code: "ja", name: "Japanese" }].map((lang) => {
                  const isSelected = filterLanguage === lang.code
                  return (
                    <TouchableOpacity key={lang.code} onPress={() => updateSetting('filterLanguage', lang.code)} style={[styles.filterChip, { backgroundColor: isSelected ? accentColor : theme.surface, borderColor: isSelected ? accentColor : theme.border }]}>
                      <Text style={[styles.chipText, { color: isSelected ? "#FFF" : theme.foreground }]}>{lang.name}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>

          {/* General Toggles */}
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

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Play size={18} color={accentColor} fill={accentColor} /></View>
                <Text style={styles.rowTitle}>Autoplay Trailers</Text>
              </View>
              <Switch value={autoplayTrailers} onValueChange={(v) => updateSetting('autoplayTrailers', v)} thumbColor={autoplayTrailers ? accentColor : "#f4f3f4"} trackColor={{ false: "#767577", true: `${accentColor}80` }} />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Wifi size={18} color={accentColor} /></View>
                <Text style={styles.rowTitle}>Wi-Fi Only Downloads</Text>
              </View>
              <Switch value={wifiOnly} onValueChange={(v) => updateSetting('wifiOnly', v)} thumbColor={wifiOnly ? accentColor : "#f4f3f4"} trackColor={{ false: "#767577", true: `${accentColor}80` }} />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Bell size={18} color={accentColor} /></View>
                <Text style={styles.rowTitle}>Push Notifications</Text>
              </View>
              <Switch value={notifications} onValueChange={(v) => updateSetting('notifications', v)} thumbColor={notifications ? accentColor : "#f4f3f4"} trackColor={{ false: "#767577", true: `${accentColor}80` }} />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Zap size={18} color={accentColor} /></View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Data Saver Mode</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>Reduces quality to save data</Text>
                </View>
              </View>
              <Switch value={dataSaver} onValueChange={(v) => updateSetting('dataSaver', v)} thumbColor={dataSaver ? accentColor : "#f4f3f4"} trackColor={{ false: "#767577", true: `${accentColor}80` }} />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Vibrate size={18} color={accentColor} /></View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Haptic Feedback</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>Vibrate on interactions</Text>
                </View>
              </View>
              <Switch value={hapticFeedback} onValueChange={(v) => updateSetting('hapticFeedback', v)} thumbColor={hapticFeedback ? accentColor : "#f4f3f4"} trackColor={{ false: "#767577", true: `${accentColor}80` }} />
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

          {/* Subtitle & Accessibility */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Subtitles & Accessibility</Text>

            <View style={[styles.row, { flexDirection: "column", alignItems: "flex-start", gap: 10 }]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Captions size={18} color={accentColor} /></View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Subtitle Size</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>Adjust subtitle text size</Text>
                </View>
              </View>
              <View style={styles.qualityContainer}>
                {(["Small", "Medium", "Large"] as const).map((size) => {
                  const isSelected = subtitleSize === size
                  return (
                    <TouchableOpacity key={size} onPress={() => updateSetting('subtitleSize', size)} style={[styles.qualityBtn, { backgroundColor: isSelected ? accentColor : theme.surface, borderColor: isSelected ? accentColor : theme.border }]}>
                      <Text style={[styles.qualityText, { color: isSelected ? "#FFF" : theme.foreground, fontFamily: isSelected ? "GeneralSans-Bold" : "GeneralSans-Medium" }]}>{size}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={[styles.row, { flexDirection: "column", alignItems: "flex-start", gap: 10 }]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><ShieldCheck size={18} color={accentColor} /></View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Content Maturity</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>Filter by age rating</Text>
                </View>
              </View>
              <View style={styles.chipRow}>
                {(["All", "PG", "PG-13", "R"] as const).map((rating) => {
                  const isSelected = maturityRating === rating
                  return (
                    <TouchableOpacity key={rating} onPress={() => updateSetting('maturityRating', rating)} style={[styles.filterChip, { backgroundColor: isSelected ? accentColor : theme.surface, borderColor: isSelected ? accentColor : theme.border }]}>
                      <Text style={[styles.chipText, { color: isSelected ? "#FFF" : theme.foreground }]}>{rating}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>

          {/* Appearance */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Appearance</Text>
            <View style={[styles.row, { flexDirection: "column", alignItems: "flex-start", gap: 10 }]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Palette size={18} color={accentColor} /></View>
                <Text style={styles.rowTitle}>Theme Accent Color</Text>
              </View>
              <View style={styles.colorsRow}>
                {accentList.map(([key, value]) => {
                  const valStr = value as string;
                  const isSelected = accentColor === valStr
                  return (
                    <TouchableOpacity key={key} onPress={() => changeAccent(valStr)} style={[styles.colorDot, { backgroundColor: valStr }, isSelected && { borderColor: theme.foreground, borderWidth: 2 }]} activeOpacity={0.8}>
                      {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>

          {/* Storage & Data Section */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Storage & Data</Text>

            <TouchableOpacity style={styles.row} onPress={handleClearHistory} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><History size={18} color="#FF6B6B" /></View>
                <Text style={[styles.rowTitle, { color: "#FF6B6B", marginLeft: 4 }]}>Clear View History</Text>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <TouchableOpacity style={styles.row} onPress={handleClearSearches} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Search size={18} color="#FF6B6B" /></View>
                <Text style={[styles.rowTitle, { color: "#FF6B6B", marginLeft: 4 }]}>Clear Search History</Text>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <TouchableOpacity style={styles.row} onPress={clearSettings} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}><Trash size={18} color="#FF6B6B" /></View>
                <Text style={[styles.rowTitle, { color: "#FF6B6B", marginLeft: 4 }]}>Reset All Settings</Text>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <LinearGradient
          colors={["transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      </Container>

      {/* Modals rendered OUTSIDE Container */}
      <SearchableSelectionModal
        visible={appLanguageModal} onClose={() => setAppLanguageModal(false)} title="App Language"
        data={languagesList} selectedValue={appLanguage}
        onSelect={(langCode: string) => {
          const matched = languagesList.find(l => l.code === langCode)
          if (matched) updateSetting('appLanguage', matched.name)
        }}
        theme={theme} accentColor={accentColor}
      />
      <SearchableSelectionModal
        visible={audioLanguageModal} onClose={() => setAudioLanguageModal(false)} title="Audio & Subtitles Language"
        data={languagesList} selectedValue={audioLanguage}
        onSelect={(langCode: string) => {
          const matched = languagesList.find(l => l.code === langCode)
          if (matched) updateSetting('audioLanguage', matched.name)
        }}
        theme={theme} accentColor={accentColor}
      />
      <SearchableSelectionModal
        visible={countriesModal} onClose={() => setCountriesModal(false)} title="Country Exclusions"
        data={countriesList} selectedValue={excludedCountries}
        onSelect={(countryCode: string) => {
          toggleCountryExclusion(countryCode)
        }}
        isCountry theme={theme} accentColor={accentColor}
      />
    </>
  )
}

function SearchableSelectionModal({
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
      <Animated.View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border, bottom: 0, paddingBottom: Math.max(bottomOffset, 32), position: "absolute", left: 0, right: 0, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.surface }]}><X size={16} color={theme.foreground} /></TouchableOpacity>
        </View>
        <TextInput placeholder="Search alphabetically..." placeholderTextColor={theme.muted} value={search} onChangeText={setSearch} style={[styles.searchInput, { backgroundColor: theme.surface, color: theme.foreground, borderColor: theme.border }]} />
        <FlatList
          data={filtered} keyExtractor={(item: any) => item.code} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={true} indicatorStyle="white"
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
        />
        <LinearGradient colors={["transparent", "transparent", theme.background]} style={styles.gradient} />
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  gradient: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" },
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
  filterSection: { gap: 12 },
  platformsGrid: { flexDirection: "row", gap: 8, width: "100%" },
  platformCard: { flex: 1, height: 72, borderRadius: 12, borderWidth: 1, justifyContent: "center", alignItems: "center", gap: 6 },
  platformLogo: { width: 24, height: 24, resizeMode: "contain" },
  platformName: { fontSize: 10, fontFamily: "GeneralSans-Semibold" },
  selectIndicator: { position: "absolute", top: 6, right: 6, width: 14, height: 14, borderRadius: 7, justifyContent: "center", alignItems: "center" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  chipText: { fontSize: 12, fontFamily: "GeneralSans-Semibold" },
  qualityContainer: { flexDirection: "row", gap: 8, width: "100%", paddingTop: 4 },
  qualityBtn: { flex: 1, height: 36, borderRadius: 10, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  qualityText: { fontSize: 12 },
  colorsRow: { flexDirection: "row", gap: 8, width: "100%", flexWrap: "wrap", paddingTop: 4 },
  colorDot: { width: 28, height: 28, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  modalContent: { height: "80%", borderRadius: 20, borderWidth: 1, borderBottomWidth: 0, padding: 20, paddingBottom: 0, gap: 16 },
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
