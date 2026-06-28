import { useState, useEffect, useRef } from "react"
import {
  StyleSheet,
  View,
  Switch,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  FlatList,
  Platform,
  Dimensions,
  Animated,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useTheme } from "../context/ThemeContext"
import { accents } from "../constants/accents"
import { useNavigation } from "@react-navigation/native"
import { useSettingsStore } from "../store/settings.store"
import { useMediaStore } from "../store/media.store"
import { LinearGradient } from "expo-linear-gradient"
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
  Vibrate
} from "lucide-react-native"


// List of 30+ major languages of the world
const languagesList = [
  { code: "ar", name: "Arabic" },
  { code: "bn", name: "Bengali" },
  { code: "zh", name: "Chinese" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" },
  { code: "en", name: "English" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "hu", name: "Hungarian" },
  { code: "id", name: "Indonesian" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ms", name: "Malay" },
  { code: "no", name: "Norwegian" },
  { code: "pl", name: "Poland" },
  { code: "pt", name: "Portuguese" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "es", name: "Spanish" },
  { code: "sv", name: "Swedish" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "vi", name: "Vietnamese" }
]

// List of 50+ major countries of the world
const countriesList = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AR", name: "Argentina" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "HR", name: "Croatia" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "EG", name: "Egypt" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "MX", name: "Mexico" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NO", name: "Norway" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RU", name: "Russia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SG", name: "Singapore" },
  { code: "ZA", name: "South Africa" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TW", name: "Taiwan" },
  { code: "TH", name: "Thailand" },
  { code: "TR", name: "Turkey" },
  { code: "UA", name: "Ukraine" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "VN", name: "Vietnam" }
]

export function SettingsScreen() {
  const { mode, changeMode, accentColor, changeAccent, theme, blurTarget } = useTheme()
  const navigation = useNavigation()
  const { downloads } = useMediaStore()

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
    setAppLanguage,
    setAudioLanguage,
    toggleCountryExclusion,
    setAutoplayTrailers,
    setWifiOnly,
    setNotifications,
    setVideoQuality,
    setFilterLanguage,
    togglePlatformSelection,
    setFilterYear,
    setSubtitleSize,
    setMaturityRating,
    setDataSaver,
    setHapticFeedback,
  } = useSettingsStore()

  // Modal visibility states
  const [appLanguageModal, setAppLanguageModal] = useState(false)
  const [audioLanguageModal, setAudioLanguageModal] = useState(false)
  const [countriesModal, setCountriesModal] = useState(false)

  const accentList = Object.entries(accents)

  const platformList = [
    { id: "netflix", name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Netflix-new-icon.png" },
    { id: "disney", name: "Disney+", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/320px-Disney%2B_logo.svg.png" },
    { id: "prime", name: "Prime Video", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/320px-Amazon_Prime_Video_logo.svg.png" },
    { id: "apple", name: "Apple TV+", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Apple_TV_Logo_2019.svg/320px-Apple_TV_Logo_2019.svg.png" }
  ]

  const activeBlurMethod = (blurTarget && blurTarget.current) ? "dimezisBlurView" : "none"

  return (
    <>
      <Container>
        {/* Telegram-style Android Settings Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[theme.background, `${theme.background}E6`, "transparent"]}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: theme.card }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={theme.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Content Settings Section */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Content Settings</Text>

            {/* App Interface Language */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setAppLanguageModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Languages size={18} color={accentColor} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>App Language</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>{appLanguage}</Text>
                </View>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Audio & Subtitles Language */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setAudioLanguageModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Globe size={18} color={accentColor} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Audio & Subtitles</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>{audioLanguage}</Text>
                </View>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Excluded Countries */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setCountriesModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Globe size={18} color="#FF6B6B" />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Country Exclusions</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>
                    {excludedCountries.length === 0
                      ? "None excluded"
                      : `${excludedCountries.length} excluded (e.g. ${excludedCountries.join(", ")})`}
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>
          </View>

          {/* Advanced Content Filters */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Playback & Feed Filters</Text>

            {/* Streaming Platforms Multi-select */}
            <View style={styles.filterSection}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Film size={18} color={accentColor} />
                </View>
                <Text style={styles.rowTitle}>Streaming Providers</Text>
              </View>
              <View style={styles.platformsGrid}>
                {platformList.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id)
                  return (
                    <TouchableOpacity
                      key={platform.id}
                      onPress={() => togglePlatformSelection(platform.id)}
                      style={[
                        styles.platformCard,
                        {
                          backgroundColor: isSelected ? `${accentColor}1A` : theme.surface,
                          borderColor: isSelected ? accentColor : theme.border
                        }
                      ]}
                      activeOpacity={0.72}
                    >
                      <Image source={{ uri: platform.logo }} style={styles.platformLogo} />
                      <Text style={[styles.platformName, isSelected && { color: accentColor }]}>
                        {platform.name}
                      </Text>
                      {isSelected && (
                        <View style={[styles.selectIndicator, { backgroundColor: accentColor }]}>
                          <Check size={8} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Year selector */}
            <View style={styles.filterSection}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Calendar size={18} color={accentColor} />
                </View>
                <Text style={styles.rowTitle}>Year Filter</Text>
              </View>
              <View style={styles.chipRow}>
                {["All", "2024", "2023", "2022", "2020+", "2010+"].map((year) => {
                  const isSelected = filterYear === year
                  return (
                    <TouchableOpacity
                      key={year}
                      onPress={() => setFilterYear(year)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: isSelected ? accentColor : theme.surface,
                          borderColor: isSelected ? accentColor : theme.border
                        }
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.chipText, { color: isSelected ? "#FFF" : theme.foreground }]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Original Language Selector */}
            <View style={styles.filterSection}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Filter size={18} color={accentColor} />
                </View>
                <Text style={styles.rowTitle}>Original Language</Text>
              </View>
              <View style={styles.chipRow}>
                {[
                  { code: "All", name: "All" },
                  { code: "en", name: "English" },
                  { code: "hi", name: "Hindi" },
                  { code: "es", name: "Spanish" },
                  { code: "ko", name: "Korean" },
                  { code: "ja", name: "Japanese" }
                ].map((lang) => {
                  const isSelected = filterLanguage === lang.code
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      onPress={() => setFilterLanguage(lang.code)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: isSelected ? accentColor : theme.surface,
                          borderColor: isSelected ? accentColor : theme.border
                        }
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.chipText, { color: isSelected ? "#FFF" : theme.foreground }]}>
                        {lang.name}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>

          {/* General Toggles */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>General Preferences</Text>

            {/* Dark Mode */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  {mode === "dark" ? <Moon size={18} color={accentColor} /> : <Sun size={18} color={accentColor} />}
                </View>
                <Text style={styles.rowTitle}>Dark Mode</Text>
              </View>
              <Switch
                value={mode === "dark"}
                onValueChange={changeMode}
                thumbColor={mode === "dark" ? accentColor : "#f4f3f4"}
                trackColor={{ false: "#767577", true: `${accentColor}80` }}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Autoplay */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Play size={18} color={accentColor} fill={accentColor} />
                </View>
                <Text style={styles.rowTitle}>Autoplay Trailers</Text>
              </View>
              <Switch
                value={autoplayTrailers}
                onValueChange={setAutoplayTrailers}
                thumbColor={autoplayTrailers ? accentColor : "#f4f3f4"}
                trackColor={{ false: "#767577", true: `${accentColor}80` }}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Wi-Fi only */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Wifi size={18} color={accentColor} />
                </View>
                <Text style={styles.rowTitle}>Wi-Fi Only Downloads</Text>
              </View>
              <Switch
                value={wifiOnly}
                onValueChange={setWifiOnly}
                thumbColor={wifiOnly ? accentColor : "#f4f3f4"}
                trackColor={{ false: "#767577", true: `${accentColor}80` }}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Push alerts */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Bell size={18} color={accentColor} />
                </View>
                <Text style={styles.rowTitle}>Push Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                thumbColor={notifications ? accentColor : "#f4f3f4"}
                trackColor={{ false: "#767577", true: `${accentColor}80` }}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Data Saver */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Zap size={18} color={accentColor} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Data Saver Mode</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>Reduces quality to save data</Text>
                </View>
              </View>
              <Switch
                value={dataSaver}
                onValueChange={setDataSaver}
                thumbColor={dataSaver ? accentColor : "#f4f3f4"}
                trackColor={{ false: "#767577", true: `${accentColor}80` }}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Haptic Feedback */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Vibrate size={18} color={accentColor} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Haptic Feedback</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>Vibrate on interactions</Text>
                </View>
              </View>
              <Switch
                value={hapticFeedback}
                onValueChange={setHapticFeedback}
                thumbColor={hapticFeedback ? accentColor : "#f4f3f4"}
                trackColor={{ false: "#767577", true: `${accentColor}80` }}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Quality */}
            <View style={[styles.row, { flexDirection: "column", alignItems: "flex-start", gap: 10 }]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Monitor size={18} color={accentColor} />
                </View>
                <Text style={styles.rowTitle}>Streaming Resolution</Text>
              </View>
              <View style={styles.qualityContainer}>
                {(["SD", "HD", "4K"] as const).map((q) => {
                  const isSelected = videoQuality === q
                  return (
                    <TouchableOpacity
                      key={q}
                      onPress={() => setVideoQuality(q)}
                      style={[
                        styles.qualityBtn,
                        {
                          backgroundColor: isSelected ? accentColor : theme.surface,
                          borderColor: isSelected ? accentColor : theme.border
                        }
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.qualityText, { color: isSelected ? "#FFF" : theme.foreground, fontFamily: isSelected ? "GeneralSans-Bold" : "GeneralSans-Medium" }]}>
                        {q === "SD" ? "SD" : q === "HD" ? "HD" : "4K Ultra"}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>

          {/* Subtitle & Accessibility */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Subtitles & Accessibility</Text>

            {/* Subtitle Size */}
            <View style={[styles.row, { flexDirection: "column", alignItems: "flex-start", gap: 10 }]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Captions size={18} color={accentColor} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Subtitle Size</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>Adjust subtitle text size</Text>
                </View>
              </View>
              <View style={styles.qualityContainer}>
                {(["Small", "Medium", "Large"] as const).map((size) => {
                  const isSelected = subtitleSize === size
                  return (
                    <TouchableOpacity
                      key={size}
                      onPress={() => setSubtitleSize(size)}
                      style={[
                        styles.qualityBtn,
                        {
                          backgroundColor: isSelected ? accentColor : theme.surface,
                          borderColor: isSelected ? accentColor : theme.border
                        }
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.qualityText, { color: isSelected ? "#FFF" : theme.foreground, fontFamily: isSelected ? "GeneralSans-Bold" : "GeneralSans-Medium" }]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Content Maturity Rating */}
            <View style={[styles.row, { flexDirection: "column", alignItems: "flex-start", gap: 10 }]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <ShieldCheck size={18} color={accentColor} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>Content Maturity</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]}>Filter by age rating</Text>
                </View>
              </View>
              <View style={styles.chipRow}>
                {(["All", "PG", "PG-13", "R"] as const).map((rating) => {
                  const isSelected = maturityRating === rating
                  return (
                    <TouchableOpacity
                      key={rating}
                      onPress={() => setMaturityRating(rating)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: isSelected ? accentColor : theme.surface,
                          borderColor: isSelected ? accentColor : theme.border
                        }
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.chipText, { color: isSelected ? "#FFF" : theme.foreground }]}>
                        {rating}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>

          {/* Accent Selector */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Appearance</Text>
            <View style={[styles.row, { flexDirection: "column", alignItems: "flex-start", gap: 10 }]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Palette size={18} color={accentColor} />
                </View>
                <Text style={styles.rowTitle}>Theme Accent Color</Text>
              </View>
              <View style={styles.colorsRow}>
                {accentList.map(([key, value]) => {
                  const isSelected = accentColor === value
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => changeAccent(value)}
                      style={[
                        styles.colorDot,
                        { backgroundColor: value },
                        isSelected && { borderColor: theme.foreground, borderWidth: 2 }
                      ]}
                      activeOpacity={0.8}
                    >
                      {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>

          {/* Storage & Cache Section */}
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Storage & System</Text>

            {/* Storage metric */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Monitor size={18} color={accentColor} />
                </View>
                <View style={{ flexDirection: "column", marginLeft: 4 }}>
                  <Text style={[styles.rowTitle, { color: theme.foreground }]}>App Storage Size</Text>
                  <Text style={[styles.rowSubtitle, { color: theme.muted, fontSize: 11, marginTop: 2 }]}>Includes downloads and metadata cache</Text>
                </View>
              </View>
              <Text style={[styles.rowTitle, { color: accentColor, fontFamily: "GeneralSans-Bold" }]}>
                {downloads.length > 0 ? `${(124 + downloads.length * 1430).toFixed(0)} MB` : "124 MB"}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Clear cache button */}
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                alert("Cache cleared successfully! 124 MB freed.")
              }}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Trash size={18} color="#FF6B6B" />
                </View>
                <Text style={[styles.rowTitle, { color: "#FF6B6B", marginLeft: 4 }]}>Clear Cached Metadata</Text>
              </View>
              <ChevronRight size={16} color={theme.muted} />
            </TouchableOpacity>
          </View>
        </ScrollView>

      </Container>

      {/* Modals rendered OUTSIDE Container/SafeAreaView — touch physical screen bottom */}
      <SearchableSelectionModal
        visible={appLanguageModal}
        onClose={() => setAppLanguageModal(false)}
        title="App Language"
        data={languagesList}
        selectedValue={appLanguage}
        onSelect={(langCode) => {
          const matched = languagesList.find(l => l.code === langCode)
          if (matched) setAppLanguage(matched.name)
        }}
        theme={theme}
        accentColor={accentColor}
      />

      <SearchableSelectionModal
        visible={audioLanguageModal}
        onClose={() => setAudioLanguageModal(false)}
        title="Audio & Subtitles Language"
        data={languagesList}
        selectedValue={audioLanguage}
        onSelect={(langCode) => {
          const matched = languagesList.find(l => l.code === langCode)
          if (matched) setAudioLanguage(matched.name)
        }}
        theme={theme}
        accentColor={accentColor}
      />

      <SearchableSelectionModal
        visible={countriesModal}
        onClose={() => setCountriesModal(false)}
        title="Country Exclusions"
        data={countriesList}
        selectedValue={excludedCountries}
        onSelect={(countryCode) => {
          toggleCountryExclusion(countryCode)
        }}
        isCountry
        theme={theme}
        accentColor={accentColor}
      />
    </>
  )
}

// Searchable Selection Modal Component
function SearchableSelectionModal({
  visible,
  onClose,
  title,
  data,
  selectedValue,
  onSelect,
  isCountry = false,
  theme,
  accentColor
}: {
  visible: boolean
  onClose: () => void
  title: string
  data: { code: string; name: string }[]
  selectedValue: any
  onSelect: (value: string) => void
  isCountry?: boolean
  theme: any
  accentColor: string
}) {
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
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: Dimensions.get("screen").height,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRenderOverlay(false)
      })
    }
  }, [visible])

  const filtered = data
    .filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  if (!renderOverlay) return null

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 9999, backgroundColor: "rgba(0,0,0,0.65)", opacity: opacityAnim, justifyContent: "flex-end" }]}>
      {/* Tap backdrop to close */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      />

      <Animated.View style={[
        styles.modalContent,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          bottom: 0,
          paddingBottom: Math.max(bottomOffset, 32),
          position: "absolute",
          left: 0,
          right: 0,
          transform: [{ translateY: slideAnim }],
        }
      ]}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.surface }]}>
            <X size={16} color={theme.foreground} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <TextInput
          placeholder="Search alphabetically..."
          placeholderTextColor={theme.muted}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, { backgroundColor: theme.surface, color: theme.foreground, borderColor: theme.border }]}
        />

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.code}
          contentContainerStyle={{ paddingBottom: 8 }}
          showsVerticalScrollIndicator={true}
          indicatorStyle="white"
          renderItem={({ item }) => {
            const isSelected = Array.isArray(selectedValue)
              ? selectedValue.includes(item.code)
              : selectedValue === item.name || selectedValue === item.code

            return (
              <TouchableOpacity
                onPress={() => onSelect(item.code)}
                style={[styles.modalItem, { borderBottomColor: theme.border }]}
                activeOpacity={0.7}
              >
                <View style={styles.modalItemLeft}>
                  {isCountry ? (
                    <Image
                      source={{ uri: `https://flagcdn.com/w80/${item.code.toLowerCase()}.png` }}
                      style={styles.flagRect}
                    />
                  ) : (
                    <View style={[styles.langBubble, { backgroundColor: theme.surface }]}>
                      <Text style={{ color: theme.muted, fontSize: 10, fontFamily: "GeneralSans-Bold" }}>
                        {item.code.toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.modalItemText, { color: theme.foreground }]}>{item.name}</Text>
                </View>
                {isSelected && (
                  <View style={[styles.indicatorCheck, { backgroundColor: accentColor }]}>
                    <Check size={10} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            )
          }}
        />

        <LinearGradient colors={["transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background,]} style={styles.gradient} />
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none"
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "GeneralSans-Bold",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 68,
    paddingBottom: 50,
    gap: 16,
  },
  section: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "GeneralSans-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rowCopy: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: "GeneralSans-Semibold",
  },
  rowSubtitle: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
    marginTop: 1,
  },
  divider: {
    height: 0.5,
    width: "100%",
  },
  filterSection: {
    gap: 12,
  },
  platformsGrid: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  platformCard: {
    flex: 1,
    height: 72,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    gap: 6,
  },
  platformLogo: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  platformName: {
    fontSize: 10,
    fontFamily: "GeneralSans-Semibold",
    color: "#FAFAFA",
  },
  selectIndicator: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontFamily: "GeneralSans-Semibold",
  },
  qualityContainer: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    paddingTop: 4,
  },
  qualityBtn: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qualityText: {
    fontSize: 12,
  },
  colorsRow: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    flexWrap: "wrap",
    paddingTop: 4,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    height: "80%",
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 20,
    paddingBottom: 0,
    gap: 16,
    borderBottomColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "GeneralSans-Bold",
    color: "#FAFAFA",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontFamily: "GeneralSans-Medium",
    fontSize: 14,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  modalItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flagRect: {
    width: 24,
    height: 16,
    borderRadius: 2,
    resizeMode: "cover",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  langBubble: {
    width: 28,
    height: 18,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  modalItemText: {
    fontSize: 15,
    fontFamily: "GeneralSans-Semibold",
  },
  indicatorCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  languageContainer: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  languageChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  languageChipText: {
    fontSize: 12,
  }
})
