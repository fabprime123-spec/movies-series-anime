import { CardItem } from "./card.type"

export interface Cast {
  id: number
  name: string
  character: string
  profile: string | null
}

export interface Trailer {
  id: string
  name: string
  key: string
  site: string
  type: string
}

export interface ProductionCompany {
  id: number
  name: string
  logo: string | null
}

export interface ProductionCountry {
  isoCode: string
  name: string
}

export interface SeasonItem {
  id: number
  name: string
  episodeCount: number
  seasonNumber: number
  poster: string | null
  overview: string
}

export interface DetailsItem {
  id: number
  type: "movie" | "series"
  title: string
  originalTitle: string
  overview: string
  poster: string
  backdrop: string
  rating: number
  releaseDate: string
  runtime?: number
  status: string
  genres: string[]
  countries: ProductionCountry[]
  languages: string[]
  productionCompanies: ProductionCompany[]
  seasons?: number
  episodes?: number
  seasonsList: SeasonItem[]
  cast: Cast[]
  trailers: Trailer[]
  recommendations: CardItem[]
  similar: CardItem[]
}