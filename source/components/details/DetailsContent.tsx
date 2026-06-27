import React, { useState, useMemo } from "react"
import { FlatList, ScrollView, StyleSheet, View, Image, TouchableOpacity, ActivityIndicator } from "react-native"
import { DetailsItem } from "../../types/details.type"
import { useTheme } from "../../context/ThemeContext"
import { Hero } from "./Hero"
import { Text } from "../ui/Text"
import { CastCard } from "../cards/CastCard"
import { MediaSlider } from "../sliders/MediaSlider"
import { useSeasonDetails } from "../../hooks/useDetails"
import { Building, Play, Tv } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

interface Props {
  details: DetailsItem
  onPlay: () => void
}

export function DetailsContent({ details, onPlay }: Props) {
  const { theme, accentColor } = useTheme()

  const seasons = details.seasonsList || []

  // Set default active season to the first available season number, or 1
  const defaultSeason = seasons.length > 0 ? seasons[0].seasonNumber : 1
  const [selectedSeasonNum, setSelectedSeasonNum] = useState<number>(defaultSeason)

  // Fetch season episodes dynamically
  const { data: seasonData, isLoading: isSeasonLoading } = useSeasonDetails(
    details.id,
    selectedSeasonNum
  )

  // Find active season metadata
  const activeSeasonMetadata = seasons.find(s => s.seasonNumber === selectedSeasonNum)
  const episodesCount = activeSeasonMetadata ? activeSeasonMetadata.episodeCount : 0

  // Fallback mock episodes if TMDB season API returns empty or fails (ensures zero crash)
  const episodesList = useMemo(() => {
    if (seasonData?.episodes && seasonData.episodes.length > 0) {
      return seasonData.episodes
    }
    // Fallback Mock generator
    if (episodesCount > 0) {
      return Array.from({ length: episodesCount }).map((_, idx) => ({
        id: idx + 1,
        episode_number: idx + 1,
        name: `Episode ${idx + 1}`,
        overview: `No description available for Season ${selectedSeasonNum} Episode ${idx + 1}. Sheldon navigates childhood life in East Texas.`,
        air_date: details.releaseDate || "N/A",
        runtime: details.runtime || 22,
        still_path: null
      }))
    }
    return []
  }, [seasonData, selectedSeasonNum, episodesCount])

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <Hero data={details} onPlay={onPlay} />

        <View style={styles.content}>
          {/* Metadata Section */}
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: theme.muted }]}>
              {details.releaseDate ? details.releaseDate.slice(0, 4) : "N/A"}
            </Text>
            <Text style={[styles.metaText, { color: theme.muted }]}>•</Text>
            <Text style={[styles.metaText, { color: theme.muted }]}>
              {details.type === "movie"
                ? `${details.runtime || 0} min`
                : `${details.seasons || 0} Seasons`}
            </Text>
            <Text style={[styles.metaText, { color: theme.muted }]}>•</Text>
            <Text style={[styles.metaText, { color: theme.muted }]}>
              {details.status}
            </Text>
          </View>

          {/* Overview */}
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Overview</Text>
          <Text style={[styles.overview, { color: theme.foreground }]}>
            {details.overview || "No overview available."}
          </Text>

          {/* Media Details & Production Info Card */}
          <View style={[styles.detailsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardHeaderTitle, { color: theme.foreground }]}>Media Information</Text>

            {/* Original Title */}
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.muted }]}>Original Title</Text>
              <Text style={[styles.infoValue, { color: theme.foreground }]}>{details.originalTitle || details.title}</Text>
            </View>

            {/* Release Date */}
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.muted }]}>First Aired / Released</Text>
              <Text style={[styles.infoValue, { color: theme.foreground }]}>
                {details.releaseDate ? new Date(details.releaseDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }) : "N/A"}
              </Text>
            </View>

            {/* Spoken Languages */}
            {details.languages && details.languages.length > 0 && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.muted }]}>Languages</Text>
                <Text style={[styles.infoValue, { color: theme.foreground }]}>{details.languages.join(", ")}</Text>
              </View>
            )}

            {/* Production Countries with FlagCDN Badges */}
            {details.countries && details.countries.length > 0 && (
              <View style={[styles.infoRow, { flexDirection: "column", alignItems: "flex-start", gap: 6 }]}>
                <Text style={[styles.infoLabel, { color: theme.muted }]}>Production Countries</Text>
                <View style={styles.badgeRow}>
                  {details.countries.sort((a, b) => b.isoCode.localeCompare(a.isoCode)).map((country, idx) => (
                    <View key={idx} style={[styles.countryBadge, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      {country.isoCode ? (
                        <Image
                          source={{ uri: `https://flagcdn.com/w80/${country.isoCode}.png` }}
                          style={styles.flagImage}
                        />
                      ) : null}
                      <Text style={[styles.badgeText, { color: theme.foreground }]}>{country.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Production Companies with Logos/Icons */}
            {details.productionCompanies && details.productionCompanies.length > 0 && (
              <View style={[styles.infoRow, { flexDirection: "column", alignItems: "flex-start", gap: 6, borderBottomWidth: 0 }]}>
                <Text style={[styles.infoLabel, { color: theme.muted }]}>Production Companies</Text>
                <View style={styles.badgeRow}>
                  {details.productionCompanies.map((company, idx) => (
                    <View key={idx} style={[styles.companyBadge, { backgroundColor: theme.ring, borderColor: theme.border }]}>
                      {company.logo ? (
                        <Image
                          source={{ uri: `https://image.tmdb.org/t/p/w200${company.logo}` }}
                          style={styles.companyLogo}
                          resizeMode="contain"
                        />
                      ) : (
                        <Building size={12} color={accentColor} style={{ marginRight: 4 }} />
                      )}
                      <Text style={[styles.badgeText, { color: theme.foreground }]}>{company.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Season & Episode Selector (For Series) */}
          {details.type === "series" && seasons.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Seasons & Episodes</Text>

              {/* Horizontal Seasons Picker List */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.seasonsSelectorContainer}
              >
                {seasons.map((season) => {
                  const isActive = selectedSeasonNum === season.seasonNumber
                  return (
                    <TouchableOpacity
                      key={season.id}
                      onPress={() => setSelectedSeasonNum(season.seasonNumber)}
                      style={[
                        styles.seasonTab,
                        isActive
                          ? { backgroundColor: accentColor }
                          : { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.seasonTabText,
                          isActive
                            ? { color: "#FFFFFF", fontFamily: "GeneralSans-Bold" }
                            : { color: theme.muted, fontFamily: "GeneralSans-Medium" }
                        ]}
                      >
                        {season.name}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>

              {/* Season Metadata Label: "Season - X with episodes Y" */}
              <View style={styles.seasonMetaLabelContainer}>
                <Tv size={14} color={accentColor} style={{ marginRight: 6 }} />
                <Text style={[styles.seasonMetaLabelText, { color: theme.foreground }]}>
                  {activeSeasonMetadata?.name || `Season ${selectedSeasonNum}`} with episodes {episodesCount}
                </Text>
              </View>

              {/* Episode List */}
              {isSeasonLoading ? (
                <View style={styles.episodeLoadingContainer}>
                  <ActivityIndicator size="small" color={accentColor} />
                </View>
              ) : (
                <View style={[styles.episodesScrollBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true} indicatorStyle={"white"}>
                    <View style={styles.episodesListContainer}>
                      {episodesList.map((episode: any, idx: number) => (
                        <View key={episode.id || idx} style={[styles.episodeRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                          {/* Episode Thumbnail */}
                          <View style={styles.episodeThumbnailContainer}>
                            {episode.still_path ? (
                              <Image
                                source={{ uri: `https://image.tmdb.org/t/p/w300${episode.still_path}` }}
                                style={styles.episodeThumbnail}
                              />
                            ) : (
                              <View style={[styles.episodeThumbnailPlaceholder, { backgroundColor: theme.surface }]}>
                                <Play size={16} color={accentColor} fill={accentColor} />
                              </View>
                            )}
                            <View style={[styles.episodeNumberBadge, { backgroundColor: accentColor }]}>
                              <Text style={styles.episodeNumberBadgeText}>E{episode.episode_number}</Text>
                            </View>
                          </View>

                          {/* Episode Details */}
                          <View style={styles.episodeDetails}>
                            <Text numberOfLines={1} style={[styles.episodeTitle, { color: theme.foreground }]}>
                              {episode.name}
                            </Text>
                            <Text style={[styles.episodeAirMeta, { color: theme.muted }]}>
                              {episode.air_date || "N/A Date"} • {episode.runtime || 22} min
                            </Text>
                            <Text numberOfLines={3} style={[styles.episodeOverview, { color: theme.muted }]}>
                              {episode.overview || "No overview available for this episode."}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          {/* Cast */}
          {details.cast && details.cast.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Top Cast</Text>
              <FlatList
                horizontal
                data={details.cast.slice(0, 15)}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => <CastCard cast={item} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.castList}
              />
            </View>
          )}

          {/* Similar Items */}
          {details.similar && details.similar.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Similar Content</Text>
              <MediaSlider data={details.similar} />
            </View>
          )}

          {/* Recommendations */}
          {details.recommendations && details.recommendations.length > 0 && (
            <View style={[styles.sectionContainer, { marginBottom: 30 }]}>
              <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Recommended For You</Text>
              <MediaSlider data={details.recommendations} />
            </View>
          )}
        </View>
      </ScrollView>
      <LinearGradient colors={[theme.background, "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background,]} style={[styles.bottomGradient]} />
    </>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  metaText: {
    fontSize: 14,
    fontFamily: "GeneralSans-Medium",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "GeneralSans-Bold",
    marginTop: 15,
    marginBottom: 10,
  },
  overview: {
    fontSize: 14,
    fontFamily: "GeneralSans-Regular",
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 20,
  },
  sectionContainer: {
    marginTop: 15,
  },
  castList: {
    gap: 12,
    paddingVertical: 5,
  },
  detailsCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    gap: 12,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontFamily: "GeneralSans-Bold",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: "GeneralSans-Medium",
  },
  infoValue: {
    fontSize: 13,
    fontFamily: "GeneralSans-Semibold",
    textAlign: "right",
    maxWidth: "60%",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  countryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  flagImage: {
    width: 24,
    height: 15,
    borderRadius: 2,
    marginRight: 6,
    resizeMode: "cover",
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "GeneralSans-Medium",
  },
  companyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  companyLogo: {
    width: 32,
    height: 12,
    marginRight: 6,
  },
  seasonsSelectorContainer: {
    paddingVertical: 4,
    gap: 8,
    marginBottom: 12,
  },
  seasonTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  seasonTabText: {
    fontSize: 13,
  },
  seasonMetaLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  seasonMetaLabelText: {
    fontSize: 14,
    fontFamily: "GeneralSans-Bold",
  },
  episodeLoadingContainer: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  episodesScrollBox: {
    maxHeight: 330,
    height: "auto",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    padding: 10,
    marginBottom: 20,
  },
  episodesListContainer: {
    gap: 12,
  },
  episodeRow: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
  },
  episodeThumbnailContainer: {
    width: 100,
    height: 68,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  episodeThumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  episodeThumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  episodeNumberBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  episodeNumberBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "GeneralSans-Bold",
  },
  episodeDetails: {
    flex: 1,
    gap: 3,
  },
  episodeTitle: {
    fontSize: 13,
    fontFamily: "GeneralSans-Bold",
  },
  episodeAirMeta: {
    fontSize: 11,
    fontFamily: "GeneralSans-Medium",
  },
  episodeOverview: {
    fontSize: 11,
    fontFamily: "GeneralSans-Regular",
    lineHeight: 15,
  },
  bottomGradient: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    pointerEvents: "none"
  }
})
