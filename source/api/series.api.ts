import { tmdb } from "./client"
import { Series } from "../types/series.type"

export async function getOnTheAirSeries(): Promise<Series[]> {
  const response = await tmdb.get("/tv/on_the_air")
  return response.data.results
}

export async function getPopularSeries(): Promise<Series[]> {
  const response = await tmdb.get("/tv/popular")
  return response.data.results
}

export async function getTopRatedSeries(): Promise<Series[]> {
  const response = await tmdb.get("/tv/top_rated")
  return response.data.results
}

export async function getAiringTodaySeries(): Promise<Series[]> {
  const response = await tmdb.get("/tv/airing_today")
  return response.data.results
}