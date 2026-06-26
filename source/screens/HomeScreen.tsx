import { ScrollView, View } from "react-native"
import { useAiringTodaySeries, useOnTheAirSeries, usePopularSeries, useTopRatedSeries } from "../hooks/useSeries"
import { useNowPlayingMovies, usePopularMovies, useTopRatedMovies, useUpcomingMovies } from "../hooks/useMovies"
import { Container } from "../components/ui/Container"
import { useTrending } from "../hooks/useTrending"
import { MediaSlider } from "../components/sliders/MediaSlider"
import { normalizeMovie, normalizeSeries, normalizeTrending } from "../utils/normalize"
import { SectionHeader } from "../components/headers/SectionHeader"

export function HomeScreen() {
  const { data: nowPlayingMovies = [] } = useNowPlayingMovies()
  const { data: popularMovies = [] } = usePopularMovies()
  const { data: topRatedMovies = [] } = useTopRatedMovies()
  const { data: upComingMovies = [] } = useUpcomingMovies()

  const { data: airingTodaySeries = [] } = useAiringTodaySeries()
  const { data: popularSeries = [] } = usePopularSeries()
  const { data: topRatedSeries = [] } = useTopRatedSeries()
  const { data: onTheAirSeries = [] } = useOnTheAirSeries()

  const { data: trending = [] } = useTrending()

  return (
    <Container>
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <SectionHeader title="Airing Today Series" />
        <MediaSlider data={airingTodaySeries.map(normalizeSeries)} />
        <SectionHeader title="Popular Series" />
        <MediaSlider data={popularSeries.map(normalizeSeries)} />
        <SectionHeader title="Top Rated Series" />
        <MediaSlider data={topRatedSeries.map(normalizeSeries)} />
        <SectionHeader title="On The Air Series" />
        <MediaSlider data={onTheAirSeries.map(normalizeSeries)} />

        <View style={{ width: "100%", height: 1, backgroundColor: "#ffffff", marginVertical: 30 }} />

        <SectionHeader title="Trending" />
        <MediaSlider data={trending.map(normalizeTrending)} />

        <View style={{ width: "100%", height: 1, backgroundColor: "#ffffff", marginVertical: 30 }} />

        <SectionHeader title="Now Playing Movies" />
        <MediaSlider data={nowPlayingMovies.map(normalizeMovie)} />
        <SectionHeader title="Popular Movies" />
        <MediaSlider data={popularMovies.map(normalizeMovie)} />
        <SectionHeader title="Top Rated Movies" />
        <MediaSlider data={topRatedMovies.map(normalizeMovie)} />
        <SectionHeader title="Upcoming Movies" />
        <MediaSlider data={upComingMovies.map(normalizeMovie)} />
      </ScrollView>
    </Container>
  )
}