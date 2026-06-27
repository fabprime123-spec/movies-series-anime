import { useState } from "react"
import {
  StyleSheet,
  View,
  Switch,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import {
  ArrowLeft,
  Bell,
  Check,
  Globe,
  Monitor,
  Moon,
  Palette,
  Play,
  Sun,
  Wifi,
} from "lucide-react-native"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { accents } from "../constants/accents"
import { useTheme } from "../context/ThemeContext"

export function SettingsScreen() {
  const { mode, changeMode, accentColor, changeAccent, theme } = useTheme()
  const navigation = useNavigation()

  const [autoplayTrailers, setAutoplayTrailers] = useState(true)
  const [wifiOnly, setWifiOnly] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [videoQuality, setVideoQuality] = useState<"SD" | "HD" | "4K">("HD")
  const [language, setLanguage] = useState("English")

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: theme.card }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={theme.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={[styles.headerSubtitle, { color: theme.muted }]}>Make FabPrime feel like yours</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.summaryIcon, { backgroundColor: `${accentColor}18` }]}>
            {mode === "dark" ? <Moon size={22} color={accentColor} /> : <Sun size={22} color={accentColor} />}
          </View>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryTitle}>{mode === "dark" ? "Night cinema mode" : "Clean daylight mode"}</Text>
            <Text style={[styles.summaryText, { color: theme.muted }]}>
              {videoQuality} streaming, {language} audio, {notifications ? "alerts on" : "alerts off"}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>Preferences</Text>
          <ToggleRow icon={mode === "dark" ? Moon : Sun} title="Dark Mode" subtitle="Switch the full app appearance" value={mode === "dark"} onValueChange={changeMode} color={accentColor} surface={theme.surface} muted={theme.muted} />
          <Divider color={theme.border} />
          <ToggleRow icon={Play} title="Autoplay Trailers" subtitle="Preview trailers while browsing" value={autoplayTrailers} onValueChange={setAutoplayTrailers} color={accentColor} surface={theme.surface} muted={theme.muted} />
          <Divider color={theme.border} />
          <ToggleRow icon={Wifi} title="Wi-Fi Only Downloads" subtitle="Protect your mobile data" value={wifiOnly} onValueChange={setWifiOnly} color={accentColor} surface={theme.surface} muted={theme.muted} />
          <Divider color={theme.border} />
          <ToggleRow icon={Bell} title="Push Notifications" subtitle="New seasons, watchlist drops, and alerts" value={notifications} onValueChange={setNotifications} color={accentColor} surface={theme.surface} muted={theme.muted} />
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>Playback</Text>
          <View style={styles.groupHeader}>
            <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
              <Monitor size={20} color={accentColor} />
            </View>
            <View style={styles.groupCopy}>
              <Text style={styles.rowText}>Streaming Quality</Text>
              <Text style={[styles.rowSubtext, { color: theme.muted }]}>Choose the default playback quality</Text>
            </View>
          </View>
          <View style={styles.segmentRow}>
            {(["SD", "HD", "4K"] as const).map((quality) => {
              const isSelected = videoQuality === quality
              return (
                <TouchableOpacity
                  key={quality}
                  onPress={() => setVideoQuality(quality)}
                  style={[
                    styles.segmentButton,
                    {
                      backgroundColor: isSelected ? accentColor : theme.surface,
                      borderColor: isSelected ? accentColor : theme.border,
                    },
                  ]}
                  activeOpacity={0.78}
                >
                  <Text style={[styles.segmentText, { color: isSelected ? "#FFFFFF" : theme.foreground }]}>
                    {quality === "SD" ? "SD" : quality === "HD" ? "HD" : "4K"}
                  </Text>
                  <Text style={[styles.segmentMeta, { color: isSelected ? "rgba(255,255,255,0.76)" : theme.muted }]}>
                    {quality === "SD" ? "480p" : quality === "HD" ? "1080p" : "Ultra"}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>Personalization</Text>
          <View style={styles.groupHeader}>
            <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
              <Globe size={20} color={accentColor} />
            </View>
            <View style={styles.groupCopy}>
              <Text style={styles.rowText}>Language</Text>
              <Text style={[styles.rowSubtext, { color: theme.muted }]}>Audio and subtitle preference</Text>
            </View>
          </View>
          <View style={styles.chipRow}>
            {["English", "Spanish", "French", "Japanese"].map((item) => {
              const isSelected = language === item
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setLanguage(item)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? accentColor : theme.surface,
                      borderColor: isSelected ? accentColor : theme.border,
                    },
                  ]}
                  activeOpacity={0.78}
                >
                  <Text style={[styles.chipText, { color: isSelected ? "#FFFFFF" : theme.foreground }]}>{item}</Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <Divider color={theme.border} />

          <View style={styles.groupHeader}>
            <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
              <Palette size={20} color={accentColor} />
            </View>
            <View style={styles.groupCopy}>
              <Text style={styles.rowText}>Theme Accent</Text>
              <Text style={[styles.rowSubtext, { color: theme.muted }]}>Pick the app highlight color</Text>
            </View>
          </View>
          <View style={styles.colorsRow}>
            {Object.entries(accents).map(([key, value]) => {
              const isSelected = accentColor === value
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => changeAccent(value)}
                  style={[
                    styles.colorDot,
                    { backgroundColor: value },
                    isSelected && { borderColor: theme.foreground, borderWidth: 2 },
                  ]}
                  activeOpacity={0.8}
                >
                  {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </Container>
  )
}

function ToggleRow({
  icon: Icon,
  title,
  subtitle,
  value,
  onValueChange,
  color,
  surface,
  muted,
}: {
  icon: React.ComponentType<any>
  title: string
  subtitle: string
  value: boolean
  onValueChange: (value: boolean) => void
  color: string
  surface: string
  muted: string
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={[styles.iconBox, { backgroundColor: surface }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={styles.groupCopy}>
          <Text style={styles.rowText}>{title}</Text>
          <Text style={[styles.rowSubtext, { color: muted }]} numberOfLines={1}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? color : "#F4F3F4"}
        trackColor={{ false: "#767577", true: `${color}80` }}
      />
    </View>
  )
}

function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCopy: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "GeneralSans-Bold",
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 14,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryCopy: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: "GeneralSans-Bold",
  },
  summaryText: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
    marginTop: 3,
  },
  section: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "GeneralSans-Semibold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  rowLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  groupCopy: {
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rowText: {
    fontSize: 15,
    fontFamily: "GeneralSans-Semibold",
  },
  rowSubtext: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
    marginTop: 2,
  },
  divider: {
    height: 1,
    width: "100%",
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
  },
  segmentButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  segmentText: {
    fontSize: 15,
    fontFamily: "GeneralSans-Bold",
  },
  segmentMeta: {
    fontSize: 11,
    fontFamily: "GeneralSans-Medium",
    marginTop: 2,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    minHeight: 38,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  chipText: {
    fontSize: 12,
    fontFamily: "GeneralSans-Semibold",
  },
  colorsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
})
