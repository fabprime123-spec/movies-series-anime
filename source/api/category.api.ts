import { Movies } from "../types/movies.type"
import { Series } from "../types/series.type"
import { tmdb } from "./client"

export async function getDocumentaries(): Promise<Movies[]> {
  const response = await tmdb.get("/discover/movie", {
    params: {
      with_genres: 99
    }
  })
  return response.data.results
}

export async function getAnime(): Promise<Series[]> {
  const response = await tmdb.get("/discover/tv", {
    params: {
      with_genres: 16
    }
  })
  return response.data.results
}

export async function getKDrama(): Promise<Series[]> {
  const response = await tmdb.get("/discover/tv", {
    params: {
      with_origin_country: "KR"
    }
  })
  return response.data.results
}

export async function getCDrama(): Promise<Series[]> {
  const res = await tmdb.get("/discover/tv", {
    params: {
      with_origin_country: "CN"
    }
  })
  return res.data.results
}