import { tmdb } from "./client"

const APPEND = [
  "credits",
  "videos",
  "images",
  "recommendations",
  "similar",
  "external_ids"
].join(",")

export async function getMovieDetails(id: number) {
  const response = await tmdb.get(`/movie/${id}`, {
    params: {
      append_to_response: APPEND
    }
  })
  return response.data
}

export async function getSeriesDetails(id: number) {
  const response = await tmdb.get(`/tv/${id}`, {
    params: {
      append_to_response: APPEND
    }
  })
  return response.data
}

export async function getSeasonDetails(tvId: number, seasonNumber: number) {
  const response = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`)
  return response.data
}