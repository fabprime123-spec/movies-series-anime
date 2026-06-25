import { ImageData, Genre, ProductionCompany, Language, Country } from "./common.type"

export interface Movies extends ImageData {
  id: number
  title: string
  original_title: string
  overview: string
  tagline: string
  adult: boolean
  video: boolean
  release_date: string
  runtime: number | null
  status: string
  homepage: string | null
  imdb_id: string | null
  budget: number
  revenue: number
  popularity: number
  vote_average: number
  vote_count: number
  genres: Genre[]
  production_companies: ProductionCompany[]
  production_countries: Country[]
  spoken_languages: Language[]
}