import { genres } from "../constants/genres"
import { Genre } from "../types/genre.type"
import { tmdb } from "./client"

interface DiscoverParams {
  type: "movie" | "tv"
  genres?: string
  country?: string
  language?: string
}

function getGenreId(genre: Genre) {
  return Object.entries(genres).find(([, value]) => value === genre)?.[0]
}

async function discover(params: DiscoverParams) {
  const endpoint = params.type === "movie" ? "/discover/movie" : "/discover/tv"
  const response = await tmdb.get(endpoint, {
    params: {
      with_genres: params.genres,
      with_origin_country: params.country,
      with_original_language: params.language,
      sort_by: "popularity.desc"
    }
  })

  return response.data.results
}

export function getGenreMovies(genre: Genre) {
  return discover({
    type: "movie",
    genres: getGenreId(genre),
  })
}

export function getGenreSeries(genre: Genre) {
  return discover({
    type: "tv",
    genres: getGenreId(genre)
  })
}

export async function getAnime() {
  const animeListPromise = discover({
    type: "tv",
    genres: "16",
    country: "JP"
  })

  // Death Note (13916), Attack on Titan (61733), Demon Slayer (85937), Naruto (31910), Lookism (212726)
  const famousIds = [13916, 61733, 85937, 31910, 212726]
  const famousPromises = famousIds.map(async (id) => {
    try {
      const res = await tmdb.get(`/tv/${id}`)
      return res.data
    } catch {
      return null
    }
  })

  const [animeList = [], ...famousItems] = await Promise.all([animeListPromise, ...famousPromises])
  const validFamous = famousItems.filter(Boolean)

  const combined = [...validFamous, ...animeList]
  const seen = new Set()
  return combined.filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

export async function getDocumentaries() {
  const moviesPromise = discover({ type: "movie", genres: "99" })
  const tvPromise = discover({ type: "tv", genres: "99" })

  // Cosmos: A Spacetime Odyssey (58474), Our Planet (83880), Cosmos: A Personal Voyage (1430)
  const famousIds = [
    { id: 58474, type: "tv" },
    { id: 83880, type: "tv" },
    { id: 1430, type: "tv" }
  ]
  const famousPromises = famousIds.map(async ({ id, type }) => {
    try {
      const res = await tmdb.get(`/${type}/${id}`)
      const data = res.data
      data.media_type = type
      return data
    } catch {
      return null
    }
  })

  const [movies = [], tv = [], ...famousItems] = await Promise.all([
    moviesPromise,
    tvPromise,
    ...famousPromises
  ])

  const validFamous = famousItems.filter(Boolean)
  const taggedMovies = movies.map((m: any) => ({ ...m, media_type: "movie" }))
  const taggedTv = tv.map((t: any) => ({ ...t, media_type: "tv" }))

  const combined = [...validFamous, ...taggedMovies, ...taggedTv]
  const seen = new Set()
  return combined.filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

export function getKDrama() {
  return discover({
    type: "tv",
    country: "KR"
  })
}

export function getCDrama() {
  return discover({
    type: "tv",
    country: "CN"
  })
}

export function getJDrama() {
  return discover({
    type: "tv",
    country: "JP"
  })
}

export function getAsianDrama() {
  return discover({
    type: "tv",
    country: "KR|CN|JP"
  })
}