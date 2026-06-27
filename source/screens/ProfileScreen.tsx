import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation } from "@react-navigation/native"
import {
  Bookmark,
  ChevronRight,
  Clock,
  Download,
  Heart,
  HelpCircle,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  User,
} from "lucide-react-native"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

type MenuRowProps = {
  icon: React.ComponentType<any>
  title: string
  subtitle: string
  color: string
  surface: string
  muted: string
  onPress?: () => void
  danger?: boolean
}

export function ProfileScreen() {
  const { theme, accentColor } = useTheme()
  const { user, logout } = useAuth()
  const navigation = useNavigation<any>()
  const displayName = user?.name || "Guest Fan"
  const displayEmail = user?.email || "guest@fabprime.com"
  const firstName = displayName.split(" ")[0]

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate("Settings")}
          activeOpacity={0.7}
        >
          <Settings size={20} color={theme.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require("../../assets/poster-default.png")}
          imageStyle={styles.heroImage}
          style={[styles.heroCard, { borderColor: theme.border }]}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.62)", "rgba(0,0,0,0.92)"]}
            style={styles.heroOverlay}
          >
            <View style={styles.heroTopRow}>
              <View style={[styles.statusPill, { backgroundColor: `${accentColor}22`, borderColor: `${accentColor}66` }]}>
                <ShieldCheck size={14} color={accentColor} />
                <Text style={styles.statusText}>{user?.isGuest ? "Guest Profile" : "Member Profile"}</Text>
              </View>
              <View style={[styles.sparkBox, { backgroundColor: `${accentColor}24` }]}>
                <Sparkles size={17} color={accentColor} />
              </View>
            </View>

            <View style={styles.heroUserRow}>
              <View style={[styles.avatarWrapper, { borderColor: accentColor }]}>
                <View style={[styles.avatar, { backgroundColor: theme.surface }]}>
                  {user?.photo ? (
                    <Image source={{ uri: user.photo }} style={styles.avatarImage} />
                  ) : (
                    <User size={38} color={accentColor} />
                  )}
                </View>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.kicker}>Welcome back</Text>
                <Text style={styles.userName} numberOfLines={1}>{firstName}</Text>
                <Text style={styles.userEmail} numberOfLines={1}>{displayEmail}</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <LinearGradient
            colors={[`${accentColor}26`, "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.planGlow}
          />
          <View style={styles.planLeft}>
            <View style={[styles.planIcon, { backgroundColor: `${accentColor}18` }]}>
              <Star size={20} color={accentColor} fill={accentColor} />
            </View>
            <View style={styles.planCopy}>
              <Text style={styles.planTitle}>{user?.isGuest ? "Start your watch profile" : "FabPrime Plus"}</Text>
              <Text style={[styles.planSubtitle, { color: theme.muted }]}>
                {user?.isGuest ? "Save favorites, lists, and viewing history." : "Your personal cinema hub is active."}
              </Text>
            </View>
          </View>
          <View style={[styles.planBadge, { backgroundColor: accentColor }]}>
            <Text style={styles.planBadgeText}>{user?.isGuest ? "FREE" : "ACTIVE"}</Text>
          </View>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {[
            { value: "148", label: "Watched", icon: Clock },
            { value: "42", label: "Watchlist", icon: Bookmark },
            { value: "56", label: "Liked", icon: Heart },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <View key={item.label} style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: `${accentColor}16` }]}>
                  <Icon size={16} color={accentColor} />
                </View>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={[styles.statLabel, { color: theme.muted }]}>{item.label}</Text>
                {index < 2 && <View style={[styles.statDivider, { backgroundColor: theme.border }]} />}
              </View>
            )
          })}
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>Library</Text>
          <MenuRow icon={Bookmark} title="Watchlist Manager" subtitle="Movies and series saved for later" color={accentColor} surface={theme.surface} muted={theme.muted} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <MenuRow icon={Download} title="Offline Downloads" subtitle="Manage saved episodes and films" color={accentColor} surface={theme.surface} muted={theme.muted} />
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>Account</Text>
          <MenuRow icon={Settings} title="App Settings" subtitle="Theme, playback, language, and alerts" color={accentColor} surface={theme.surface} muted={theme.muted} onPress={() => navigation.navigate("Settings")} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <MenuRow icon={HelpCircle} title="Help & Support" subtitle="Get help with playback or your account" color={accentColor} surface={theme.surface} muted={theme.muted} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <MenuRow icon={LogOut} title="Log Out" subtitle="Return to the welcome screen" color="#FF6B6B" surface={theme.surface} muted={theme.muted} onPress={logout} danger />
        </View>
      </ScrollView>
    </Container>
  )
}

function MenuRow({ icon: Icon, title, subtitle, color, surface, muted, onPress, danger }: MenuRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.72}>
      <View style={styles.rowLeft}>
        <View style={[styles.iconBox, { backgroundColor: surface }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={styles.rowCopy}>
          <Text style={[styles.rowText, danger && { color }]}>{title}</Text>
          <Text style={[styles.rowSubtext, { color: muted }]} numberOfLines={1}>{subtitle}</Text>
        </View>
      </View>
      <ChevronRight size={18} color={muted} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
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
    paddingTop: 8,
    paddingBottom: 110,
    gap: 14,
  },
  heroCard: {
    height: 218,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  heroImage: {
    resizeMode: "cover",
    opacity: 0.55,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusPill: {
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "GeneralSans-Semibold",
  },
  sparkBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  heroUserRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14,
  },
  avatarWrapper: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 38,
  },
  userInfo: {
    flex: 1,
  },
  kicker: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontFamily: "GeneralSans-Semibold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 34,
    fontFamily: "ClashGrotesk-Bold",
    marginTop: 2,
  },
  userEmail: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    fontFamily: "GeneralSans-Medium",
    marginTop: 2,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    overflow: "hidden",
  },
  planGlow: {
    ...StyleSheet.absoluteFill,
  },
  planLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  planIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  planCopy: {
    flex: 1,
  },
  planTitle: {
    fontSize: 15,
    fontFamily: "GeneralSans-Bold",
  },
  planSubtitle: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
    marginTop: 2,
  },
  planBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  planBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "GeneralSans-Bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    gap: 5,
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontFamily: "GeneralSans-Bold",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
  },
  statDivider: {
    width: 1,
    height: 52,
    position: "absolute",
    right: 0,
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
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rowCopy: {
    flex: 1,
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
})
