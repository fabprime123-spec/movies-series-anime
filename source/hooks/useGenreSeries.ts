import { useQuery } from "@tanstack/react-query"
import { getGenreSeries } from "../api/category.api"
import { Genre } from "../types/genre.type"

export function useGenreSeries(genre: Genre) {
  return useQuery({
    queryKey: ["genre-series", genre],
    queryFn: () => getGenreSeries(genre)
  })
}