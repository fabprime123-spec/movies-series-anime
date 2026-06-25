import { Image, View, FlatList, TouchableOpacity, ScrollView } from "react-native"
import { usePopularSeries } from "../hooks/useSeries"
import { usePopularMovies } from "../hooks/useMovies"
import { Container } from "../components/ui/Container"
import { useTrending } from "../hooks/useTrending"
import { MediaSlider } from "../components/sliders/MediaSlider"
import { normalizeMovie, normalizeSeries, normalizeTrending } from "../utils/normalize"

export function HomeScreen() {
  const { data: movies = [] } = usePopularMovies()
  const { data: series = [] } = usePopularSeries()
  const { data: trending = [] } = useTrending()

  return (
    <Container>
      <ScrollView>
        <MediaSlider data={movies.map(normalizeMovie)} />
        <MediaSlider data={series.map(normalizeSeries)} />
        <MediaSlider data={trending.map(normalizeTrending)} />
      </ScrollView>
    </Container>
  )
}