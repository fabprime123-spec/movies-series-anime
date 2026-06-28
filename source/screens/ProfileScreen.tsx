import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { useMediaStore } from "../store/media.store"
import { useNavigation } from "@react-navigation/native"
import {
  User,
  Settings,
  Bookmark,
  Download,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  Mail,
  UserCheck,
  Award,
  Film,
  Heart,
  History,
} from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

export function ProfileScreen() {
  const { theme, accentColor } = useTheme()
  const { user, logout } = useAuth()
  const navigation = useNavigation<any>()
  const { favorites, watchlist, history } = useMediaStore()

  const displayName = user?.name || "Guest Fan"
  const displayEmail = user?.email || "guest@fabprime.com"
  const username = `@${displayName.toLowerCase().replace(/\s+/g, "")}`

  return (
    <Container>
      {/* Sticky Glassmorphic Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[theme.background, `${theme.background}E6`, "transparent"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerContentWrapper}>
          <Text style={[styles.headerTitle, { color: theme.foreground }]}>My Profile</Text>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate("Settings")}
            activeOpacity={0.7}
          >
            <Settings size={18} color={theme.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Glowing Profile Header section */}
        <LinearGradient
          colors={[theme.card, `${accentColor}1A`, theme.card]}
          style={styles.telegramHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* User Details */}
          <View style={styles.profileMeta}>
            <View style={[styles.avatarWrapper, { borderColor: accentColor }]}>
              {user?.photo ? (
                <Image source={{ uri: user.photo }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: `${accentColor}1A` }]}>
                  <User size={48} color={accentColor} />
                </View>
              )}
            </View>
            <View style={styles.nameSection}>
              <View style={styles.nameRow}>
                <Text style={[styles.displayName, { color: theme.foreground }]}>{displayName}</Text>
                {!user?.isGuest && (
                  <View style={[styles.proBadge, { backgroundColor: accentColor }]}>
                    <Sparkles size={10} color="#FFF" />
                    <Text style={styles.proText}>PRO</Text>
                  </View>
                )}
              </View>
              <Text style={styles.statusText}>online</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Telegram Info Section */}
        <View style={[styles.telegramSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: accentColor }]}>Info</Text>

          {/* Email row */}
          <View style={styles.infoRow}>
            <Mail size={18} color={theme.muted} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoValue, { color: theme.foreground }]}>{displayEmail}</Text>
              <Text style={[styles.infoLabel, { color: theme.muted }]}>Email Address</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Username row */}
          <View style={styles.infoRow}>
            <UserCheck size={18} color={theme.muted} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoValue, { color: theme.foreground }]}>{username}</Text>
              <Text style={[styles.infoLabel, { color: theme.muted }]}>Username</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Subscription status */}
          <View style={styles.infoRow}>
            <Award size={18} color={theme.muted} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoValue, { color: theme.foreground }]}>
                {user?.isGuest ? "Free Tier" : "FabPrime Plus Membership"}
              </Text>
              <Text style={[styles.infoLabel, { color: theme.muted }]}>Subscription Status</Text>
            </View>
          </View>
        </View>

        {/* Profile Statistics Dashboard Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity style={[styles.statCellCard, { backgroundColor: theme.card, borderColor: theme.border }]} activeOpacity={0.7}>
            <View style={[styles.statIconBox, { backgroundColor: `${accentColor}12` }]}>
              <History size={18} color={accentColor} />
            </View>
            <Text style={[styles.statGridNumber, { color: theme.foreground }]}>{history.length}</Text>
            <Text style={[styles.statGridLabel, { color: theme.muted }]}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statCellCard, { backgroundColor: theme.card, borderColor: theme.border }]} activeOpacity={0.7} onPress={() => navigation.navigate("Library")}>
            <View style={[styles.statIconBox, { backgroundColor: `${accentColor}12` }]}>
              <Bookmark size={18} color={accentColor} />
            </View>
            <Text style={[styles.statGridNumber, { color: theme.foreground }]}>{watchlist.length}</Text>
            <Text style={[styles.statGridLabel, { color: theme.muted }]}>Watchlist</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statCellCard, { backgroundColor: theme.card, borderColor: theme.border }]} activeOpacity={0.7}>
            <View style={[styles.statIconBox, { backgroundColor: `${accentColor}12` }]}>
              <Heart size={18} color="#FF6B6B" />
            </View>
            <Text style={[styles.statGridNumber, { color: theme.foreground }]}>{favorites.length}</Text>
            <Text style={[styles.statGridLabel, { color: theme.muted }]}>Liked</Text>
          </TouchableOpacity>
        </View>

        {/* Library Section */}
        <View style={[styles.telegramSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>Library</Text>
          <MenuRow icon={Bookmark} title="Watchlist Manager" subtitle="Manage your saved watchlist" color={accentColor} theme={theme} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <MenuRow icon={Download} title="Offline Downloads" subtitle="Saved videos and download settings" color={accentColor} theme={theme} />
        </View>

        {/* Settings & Support Section */}
        <View style={[styles.telegramSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>Settings & Support</Text>
          <MenuRow icon={Settings} title="App Settings" subtitle="Preferences, languages, and country filters" color={accentColor} theme={theme} onPress={() => navigation.navigate("Settings")} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <MenuRow icon={HelpCircle} title="Help & Support" subtitle="Guides, FAQs, and contact" color={accentColor} theme={theme} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <MenuRow icon={LogOut} title="Log Out" subtitle="Disconnect from FabPrime" color="#FF0000" theme={theme} onPress={logout} danger />
        </View>
      </ScrollView>
    </Container>
  )
}

function MenuRow({ icon: Icon, title, subtitle, color, theme, onPress, danger }: any) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuRowLeft}>
        <View style={[styles.iconBox, { backgroundColor: `${theme.surface}B3` }]}>
          <Icon size={18} color={color} />
        </View>
        <View style={styles.menuRowCopy}>
          <Text style={[styles.menuRowTitle, danger && { color }]}>{title}</Text>
          <Text style={[styles.menuRowSubtitle, { color: theme.muted }]}>{subtitle}</Text>
        </View>
      </View>
      <ChevronRight size={16} color={theme.muted} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 55,
    paddingBottom: 110,
    gap: 14,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 60,
  },
  headerContentWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "GeneralSans-Bold",
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  telegramHeader: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginHorizontal: 16,
    gap: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  profileMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  avatarWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 38,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  nameSection: {
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  displayName: {
    fontSize: 22,
    fontFamily: "GeneralSans-Bold",
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  proText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontFamily: "GeneralSans-Bold",
  },
  statusText: {
    color: "#52B788",
    fontSize: 13,
    fontFamily: "GeneralSans-Medium",
    marginTop: 2,
  },
  telegramSection: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "GeneralSans-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: "GeneralSans-Semibold",
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
    marginTop: 1,
  },
  divider: {
    height: 0.5,
    width: "100%",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
  },
  statCellCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statGridNumber: {
    fontSize: 16,
    fontFamily: "GeneralSans-Bold",
  },
  statGridLabel: {
    fontSize: 10,
    fontFamily: "GeneralSans-Medium",
    marginTop: 1,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  menuRowCopy: {
    flex: 1,
  },
  menuRowTitle: {
    fontSize: 15,
    fontFamily: "GeneralSans-Semibold",
  },
  menuRowSubtitle: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
    marginTop: 1,
  }
})
