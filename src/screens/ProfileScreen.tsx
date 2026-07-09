import React from "react"
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, } from "react-native"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useTheme } from "../theme/ThemeContext"
import { useAuth } from "../store/AuthContext"
import { useHistory } from "../store/HistoryContext"
import { useWatchlist } from "../store/WatchlistContext"
import { useFavorites } from "../store/FavoritesContext"
import { useNavigation } from "@react-navigation/native"
import { User, Settings, Bookmark, Download, HelpCircle, LogOut, ChevronRight, Sparkles, Mail, UserCheck, Award, History, Heart, GitBranch, } from "lucide-react-native"
import LinearGradient from 'react-native-linear-gradient'

export function ProfileScreen() {
  const { theme, accentColor } = useTheme()
  const { user, logout } = useAuth()
  const navigation = useNavigation<any>()

  const { history } = useHistory()
  const { watchlist } = useWatchlist()
  const { favorites } = useFavorites()

  const displayName = user?.name || "Guest Fan"
  const displayEmail = user?.email || "guest@fabprime.com"
  const username = `@${displayName.toLowerCase().replace(/\s+/g, "")}`

  return (
    <Container style={styles.container} useSafeArea={true}>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={[theme.background, `${theme.background}E6`, "transparent"]}
            style={[StyleSheet.absoluteFill]}
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
        {/* Glowing Profile Header section */}
        <LinearGradient
          colors={[theme.card, `${accentColor}22`, theme.card]}
          style={styles.telegramHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
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
          <TouchableOpacity style={[styles.statCellCard, { backgroundColor: theme.card, borderColor: theme.border }]} activeOpacity={0.7} onPress={() => navigation.navigate("Library")}>
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

          <TouchableOpacity style={[styles.statCellCard, { backgroundColor: theme.card, borderColor: theme.border }]} activeOpacity={0.7} onPress={() => navigation.navigate("Library")}>
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
          <MenuRow icon={Bookmark} title="Watchlist Manager" subtitle="Manage your saved watchlist" color={accentColor} theme={theme} onPress={() => navigation.navigate("Library")} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <MenuRow icon={Download} title="Offline Downloads" subtitle="Saved videos and download settings" color={accentColor} theme={theme} />
        </View>

        {/* Settings & Support Section */}
        <View style={[styles.telegramSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>Settings & Support</Text>
          <MenuRow icon={GitBranch} title="GitHub" subtitle="Source Code & Updates on Github" color={"#ffffff99"} theme={theme} onPress={() => navigation.navigate("Settings")} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <MenuRow icon={HelpCircle} title="Help & Support" subtitle="Guides, FAQs, and contact" color={accentColor} theme={theme} />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <MenuRow icon={LogOut} title="Log Out" subtitle="Disconnect from FabPrime" color="#FF0000" theme={theme} onPress={logout} danger />
        </View>
      </ScrollView>
      {/* Sticky Glassmorphic Header */}

      <LinearGradient
        colors={[theme.background, "transparent"]}
        style={[StyleSheet.absoluteFill, {
          maxHeight: 30
        }]}
      />
    </Container>
  )
}

function MenuRow({ icon: Icon, title, subtitle, color, theme, onPress, danger }: any) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuRowLeft}>
        <View style={[styles.iconBox, { backgroundColor: danger ? "#FF00001A" : theme.surface }]}>
          <Icon size={18} color={danger ? "#FF0000" : color} />
        </View>
        <View style={styles.menuRowCopy}>
          <Text style={[styles.menuRowTitle, danger && { color: "#FF0000" }]}>{title}</Text>
          <Text style={[styles.menuRowSubtitle, { color: theme.muted }]}>{subtitle}</Text>
        </View>
      </View>
      <ChevronRight size={16} color={theme.muted} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0
  },
  headerContainer: {
    height: 60,
  },
  headerContentWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingTop: 10,
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
    paddingHorizontal: 8,
    paddingBottom: 120,
    gap: 16,
  },
  telegramHeader: {
    borderRadius: 20,
    padding: 20,
  },
  profileMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    padding: 2,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  nameSection: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  displayName: {
    fontSize: 20,
    fontFamily: "GeneralSans-Bold",
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  proText: {
    color: "#FFF",
    fontSize: 10,
    fontFamily: "GeneralSans-Bold",
  },
  statusText: {
    color: "#10B981",
    fontSize: 14,
    fontFamily: "GeneralSans-Medium",
    marginTop: 4,
  },
  telegramSection: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "GeneralSans-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoIcon: {
    marginTop: 2,
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
    marginTop: 2,
  },
  divider: {
    height: 0.5,
    width: "100%",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCellCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  statGridNumber: {
    fontSize: 18,
    fontFamily: "GeneralSans-Bold",
  },
  statGridLabel: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuRowCopy: {
    justifyContent: "center",
  },
  menuRowTitle: {
    fontSize: 15,
    fontFamily: "GeneralSans-Semibold",
  },
  menuRowSubtitle: {
    fontSize: 12,
    fontFamily: "GeneralSans-Medium",
    marginTop: 2,
  }
})
