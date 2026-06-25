import { useQuery } from "@tanstack/react-query"

import {
  getOnTheAirSeries,
  getPopularSeries,
  getTopRatedSeries,
  getAiringTodaySeries
} from "../api/series.api"

export function useOnTheAirSeries() {
  return useQuery({
    queryKey: ["series", "on-the-air"],
    queryFn: getOnTheAirSeries
  })
}

export function usePopularSeries() {
  return useQuery({
    queryKey: ["series", "popular"],
    queryFn: getPopularSeries
  })
}


export function useTopRatedSeries() {
  return useQuery({
    queryKey: ["series", "top-rated"],
    queryFn: getTopRatedSeries
  })
}


export function useAiringTodaySeries() {
  return useQuery({
    queryKey: ["series", "airing"],
    queryFn: getAiringTodaySeries
  })
}