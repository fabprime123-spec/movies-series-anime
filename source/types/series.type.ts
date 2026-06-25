import { Country, Genre, ImageData, Language, ProductionCompany } from "./common.type"

export interface Series extends ImageData {
  id: number
  name: string
  original_name: string
  overview: string
  first_air_date: string
  last_air_date: string
  status: string
  type: string
  homepage: string | null
  number_of_seasons: number
  number_of_episodes: number
  episode_run_time: number[]
  in_production: boolean
  popularity: number
  vote_average: number
  vote_count: number
  genres: Genre[]
  origin_country: string[]
  production_countries: Country[]
  spoken_languages: Language[]
  seasons: Season[]
  production_companies: ProductionCompany[]
}

export interface Season {
  id: number
  name: string
  overview: string
  air_date: string
  episode_count: number
  poster_path: string | null
  season_number: number
}