import React, { useState, useRef, useEffect } from "react"
import { StyleSheet, View, Switch, ScrollView, TouchableOpacity, Image, TextInput, FlatList, Dimensions, Animated, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useTheme } from "../theme/ThemeContext"
import { accents } from "../constants/accents"
import { useNavigation } from "@react-navigation/native"
import { useSettings } from "../store/SettingsContext"
import { useHistory } from "../store/HistoryContext"
import { useSearchHistory } from "../store/SearchHistoryContext"
import { NativeGradient } from '../components/native/NativeGradient'
import { ArrowLeft, Moon, Sun, Palette, Play, Wifi, Bell, Monitor, Globe, Check, ChevronRight, Languages, Filter, Film, Calendar, X, Trash, Captions, ShieldCheck, Zap, Vibrate, History, Search, ChevronLeft } from "lucide-react-native"
import { Switch as CustomSwitch } from "../components/ui/Switch"

export const languagesList = [
  { code: "af", name: "Afrikaans" },
  { code: "sq", name: "Albanian" },
  { code: "am", name: "Amharic" },
  { code: "ar", name: "Arabic" },
  { code: "hy", name: "Armenian" },
  { code: "az", name: "Azerbaijani" },
  { code: "eu", name: "Basque" },
  { code: "be", name: "Belarusian" },
  { code: "bn", name: "Bengali" },
  { code: "bs", name: "Bosnian" },
  { code: "bg", name: "Bulgarian" },
  { code: "my", name: "Burmese" },
  { code: "ca", name: "Catalan" },
  { code: "ceb", name: "Cebuano" },
  { code: "zh", name: "Chinese" },
  { code: "hr", name: "Croatian" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" },
  { code: "en", name: "English" },
  { code: "eo", name: "Esperanto" },
  { code: "et", name: "Estonian" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "fy", name: "Frisian" },
  { code: "gl", name: "Galician" },
  { code: "ka", name: "Georgian" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "gu", name: "Gujarati" },
  { code: "ht", name: "Haitian Creole" },
  { code: "ha", name: "Hausa" },
  { code: "haw", name: "Hawaiian" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "hmn", name: "Hmong" },
  { code: "hu", name: "Hungarian" },
  { code: "is", name: "Icelandic" },
  { code: "ig", name: "Igbo" },
  { code: "id", name: "Indonesian" },
  { code: "ga", name: "Irish" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "jv", name: "Javanese" },
  { code: "kn", name: "Kannada" },
  { code: "kk", name: "Kazakh" },
  { code: "km", name: "Khmer" },
  { code: "ko", name: "Korean" },
  { code: "ku", name: "Kurdish" },
  { code: "ky", name: "Kyrgyz" },
  { code: "lo", name: "Lao" },
  { code: "la", name: "Latin" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "lb", name: "Luxembourgish" },
  { code: "mk", name: "Macedonian" },
  { code: "mg", name: "Malagasy" },
  { code: "ms", name: "Malay" },
  { code: "ml", name: "Malayalam" },
  { code: "mt", name: "Maltese" },
  { code: "mi", name: "Māori" },
  { code: "mr", name: "Marathi" },
  { code: "mn", name: "Mongolian" },
  { code: "ne", name: "Nepali" },
  { code: "no", name: "Norwegian" },
  { code: "ny", name: "Nyanja" },
  { code: "or", name: "Odia" },
  { code: "ps", name: "Pashto" },
  { code: "fa", name: "Persian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "pa", name: "Punjabi" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sm", name: "Samoan" },
  { code: "gd", name: "Scots Gaelic" },
  { code: "sr", name: "Serbian" },
  { code: "st", name: "Sesotho" },
  { code: "sn", name: "Shona" },
  { code: "sd", name: "Sindhi" },
  { code: "si", name: "Sinhala" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "so", name: "Somali" },
  { code: "es", name: "Spanish" },
  { code: "su", name: "Sundanese" },
  { code: "sw", name: "Swahili" },
  { code: "sv", name: "Swedish" },
  { code: "tl", name: "Tagalog" },
  { code: "tg", name: "Tajik" },
  { code: "ta", name: "Tamil" },
  { code: "tt", name: "Tatar" },
  { code: "te", name: "Telugu" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "tk", name: "Turkmen" },
  { code: "uk", name: "Ukrainian" },
  { code: "ur", name: "Urdu" },
  { code: "ug", name: "Uyghur" },
  { code: "uz", name: "Uzbek" },
  { code: "vi", name: "Vietnamese" },
  { code: "cy", name: "Welsh" },
  { code: "xh", name: "Xhosa" },
  { code: "yi", name: "Yiddish" },
  { code: "yo", name: "Yoruba" },
  { code: "zu", name: "Zulu" },
]

export const countriesList = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CV", name: "Cabo Verde" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia" },
  { code: "CD", name: "Democratic Republic of the Congo" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "GD", name: "Grenada" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "North Korea" },
  { code: "KR", name: "South Korea" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Laos" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "MK", name: "North Macedonia" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestine" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VA", name: "Vatican City" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
]

const platformList = [
  { id: "netflix", name: "Netflix", logo: "https://img.logo.dev/netflix12.com?token=pk_cxnUR6VpRn-IQV46IhPFpQ&format=png" },
  { id: "disney", name: "Disney+", logo: "https://img.logo.dev/disneyplus.com?token=pk_cxnUR6VpRn-IQV46IhPFpQ&format=png" },
  { id: "prime", name: "Prime Video", logo: "https://img.logo.dev/amazonprimevideo.com?token=pk_cxnUR6VpRn-IQV46IhPFpQ&format=png" },
  { id: "apple", name: "Apple TV+", logo: "https://img.logo.dev/tv.apple.com?token=pk_cxnUR6VpRn-IQV46IhPFpQ&format=png" }
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
                  <Text style={[styles.rowSubtitle, { color: theme.muted }]} ellipsizeMode="tail">
                    {excludedCountries.length === 0 ? "None excluded" : `${excludedCountries.length} excluded (e.g. ${excludedCountries.join(", ")})`}
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
                      <View style={{ maxHeight: 30, aspectRatio: 1, borderRadius: 8, overflow: "hidden" }}>
                        <Image source={{ uri: platform.logo }} style={styles.platformLogo} />
                      </View>
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
              {/* <Switch value={autoplayTrailers} onValueChange={(v) => updateSetting('autoplayTrailers', v)} thumbColor={autoplayTrailers ? accentColor : "#f4f3f4"} trackColor={{ false: "#767577", true: `${accentColor}80` }} /> */}
              <CustomSwitch />
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
        <NativeGradient
          colors={["transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
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
  platformLogo: { flex: 1, aspectRatio: 1, resizeMode: "contain" },
  platformName: { fontSize: 10, fontFamily: "GeneralSans-Semibold" },
  selectIndicator: { position: "absolute", top: 6, right: 6, width: 14, height: 14, borderRadius: 7, justifyContent: "center", alignItems: "center" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  chipText: { fontSize: 12, fontFamily: "GeneralSans-Semibold" },
  qualityContainer: { flexDirection: "row", gap: 8, width: "100%", paddingTop: 4 },
  qualityBtn: { flex: 1, height: 36, borderRadius: 10, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  qualityText: { fontSize: 12 },
  colorsRow: { gap: 12, paddingTop: 4 },
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
