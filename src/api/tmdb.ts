import axios from 'axios'
import { TMDB_KEY } from '../constants/token'
import { TMDBResponse, TMDBMedia } from '../types/tmdb'

const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${TMDB_KEY}`,
    'Content-Type': 'application/json',
  },
})

let globalBannedCountry: string | null = null

export const setGlobalBannedCountry = (code: string | null) => {
  globalBannedCountry = code
}

// Global interceptor to filter out banned countries from ALL responses
apiClient.interceptors.response.use((response) => {
  if (globalBannedCountry && response.data && Array.isArray(response.data.results)) {
    response.data.results = response.data.results.filter((item: any) => {
      // For TV and Movies, origin_country is an array of country codes
      if (item.origin_country && Array.isArray(item.origin_country)) {
        return !item.origin_country.includes(globalBannedCountry)
      }
      return true
    })
  }
  return response
})

// Helper for combined queries
const fetchCombined = async (movieQuery: string, tvQuery: string): Promise<TMDBResponse> => {
  const [movieRes, tvRes] = await Promise.all([
    apiClient.get<TMDBResponse>(`/discover/movie?${movieQuery}`),
    apiClient.get<TMDBResponse>(`/discover/tv?${tvQuery}`)
  ])

  const combined = [...movieRes.data.results, ...tvRes.data.results]
  combined.sort((a, b) => b.popularity - a.popularity)

  return {
    page: 1,
    results: combined.slice(0, 20),
    total_pages: 1,
    total_results: combined.length
  }
}

export const getTrending = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/trending/all/week')
  return response.data
}

// --- MOVIES ---
export const getNowPlayingMovies = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/movie/now_playing')
  return response.data
}

export const getPopularMovies = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/movie/popular')
  return response.data
}

export const getTopRatedMovies = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/movie/top_rated')
  return response.data
}

export const getUpcomingMovies = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/movie/upcoming')
  return response.data
}

// --- SERIES ---
export const getAiringTodaySeries = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/tv/airing_today')
  return response.data
}

export const getPopularSeries = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/tv/popular')
  return response.data
}

export const getTopRatedSeries = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/tv/top_rated')
  return response.data
}

export const getOnTheAirSeries = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/tv/on_the_air')
  return response.data
}

// --- ASIAN DRAMAS ---
export const getKDrama = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/discover/tv?with_original_language=ko&without_genres=16')
  return response.data
}

export const getCDrama = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/discover/tv?with_original_language=zh&without_genres=16')
  return response.data
}

export const getJDrama = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/discover/tv?with_original_language=ja&without_genres=16')
  return response.data
}

export const getAsianDrama = async (): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>('/discover/tv?with_original_language=ko|zh|ja|th|tw&without_genres=16')
  return response.data
}

// --- GENRES (Combined Movies & Series) ---
export const getAnime = async (): Promise<TMDBResponse> => {
  // Animation genre (16) + Asian original languages
  const query = 'with_genres=16&with_original_language=ja|ko|zh'
  return fetchCombined(query, query)
}

export const getAnimation = async (): Promise<TMDBResponse> => {
  // Animation genre (16)
  const query = 'with_genres=16'
  return fetchCombined(query, query)
}

export const getDocumentaries = async (): Promise<TMDBResponse> => {
  const query = 'with_genres=99'
  return fetchCombined(query, query)
}

export const getMusic = async (): Promise<TMDBResponse> => {
  const query = 'with_genres=10402'
  return fetchCombined(query, query)
}

export const getFantasy = async (): Promise<TMDBResponse> => {
  return fetchCombined('with_genres=14', 'with_genres=10765')
}

export const getSciFi = async (): Promise<TMDBResponse> => {
  return fetchCombined('with_genres=878', 'with_genres=10765')
}

export const getBiography = async (): Promise<TMDBResponse> => {
  // Biography is roughly History in TMDB (genre 36 for movie)
  const query = 'with_genres=36'
  return fetchCombined(query, query)
}

// --- SEARCH ---
export const searchMedia = async (query: string): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>(`/search/multi?query=${encodeURIComponent(query)}`)
  return response.data
}

export const getMediaDetails = async (id: number, type: 'movie' | 'tv') => {
  const response = await apiClient.get(`/${type}/${id}?append_to_response=credits,similar,recommendations,videos,images,keywords&include_image_language=en,null`)
  return response.data
}
