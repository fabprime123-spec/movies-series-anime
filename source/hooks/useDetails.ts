import { getMovieDetails, getSeriesDetails, getSeasonDetails } from "../api/details.api"
import { useQuery } from "@tanstack/react-query"

interface Props {
  id: number
  type: "movie" | "movies" | "series"
}

export function useDetails({ id, type }: Props) {
  if (type === "movies" || type === "movie") {
    return useQuery({
      queryKey: ["movies-details", id],
      queryFn: () => getMovieDetails(id),
      enabled: !!id
    })
  }
  else {
    return useQuery({
      queryKey: ["series-details", id],
      queryFn: () => getSeriesDetails(id),
      enabled: !!id
    })
  }
}

export function useSeasonDetails(tvId: number, seasonNumber: number) {
  return useQuery({
    queryKey: ["season-details", tvId, seasonNumber],
    queryFn: () => getSeasonDetails(tvId, seasonNumber),
    enabled: !!tvId && seasonNumber !== undefined
  })
}