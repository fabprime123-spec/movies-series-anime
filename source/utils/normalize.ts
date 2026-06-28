import { CardItem } from "../types/card.type"
import { Movies } from "../types/movies.type"
import { Series } from "../types/series.type"


const langToCountry: { [key: string]: string } = {
  hi: "IN", te: "IN", ta: "IN", ml: "IN", kn: "IN", mr: "IN", pa: "IN", bn: "IN",
  ja: "JP", ko: "KR", zh: "CN", cn: "CN", fr: "FR", de: "DE", es: "ES", tr: "TR"
}

function getCountries(item: any): string[] {
  const originCountries = [...(item.origin_country ?? [])]
  if (item.production_countries) {
    item.production_countries.forEach((c: any) => {
      if (c.iso_3166_1 && !originCountries.includes(c.iso_3166_1)) {
        originCountries.push(c.iso_3166_1)
      }
    })
  }
  if (originCountries.length === 0 && item.original_language) {
    const mapped = langToCountry[item.original_language]
    if (mapped) {
      originCountries.push(mapped)
    }
  }
  return originCountries
}

export function normalizeMovies(item: any): CardItem {
  const originCountries = getCountries(item)
  const year = item.release_date ? item.release_date.slice(0, 4) : "N/A"
  const platforms = ["netflix", "disney", "prime", "apple"]
  const platform = platforms[item.id % platforms.length]
  return {
    id: item.id,
    title: item.title,
    poster: item.poster_path,
    backdrop: item.backdrop_path,
    release_date: year,
    rating: item.vote_average,
    type: "movie",
    countries: originCountries,
    original_language: item.original_language || "en",
    platform,
    release_year: year
  }
}

export function normalizeSeries(item: any): CardItem {
  const originCountries = getCountries(item)
  const year = item.first_air_date ? item.first_air_date.slice(0, 4) : "N/A"
  const platforms = ["netflix", "disney", "prime", "apple"]
  const platform = platforms[item.id % platforms.length]
  return {
    id: item.id,
    title: item.name,
    poster: item.poster_path,
    backdrop: item.backdrop_path,
    release_date: year,
    rating: item.vote_average,
    type: "series",
    countries: originCountries,
    original_language: item.original_language || "en",
    platform,
    release_year: year
  }
}

export function normalizeTrending(item: any): CardItem {
  const originCountries = getCountries(item)
  const year = (item.release_date || item.first_air_date) ? (item.release_date || item.first_air_date).slice(0, 4) : "N/A"
  const platforms = ["netflix", "disney", "prime", "apple"]
  const platform = platforms[item.id % platforms.length]
  return {
    id: item.id,
    title: item.title || item.name,
    poster: item.poster_path,
    backdrop: item.backdrop_path,
    release_date: year,
    rating: item.vote_average,
    type: item.media_type === "movie" ? "movie" : "series",
    countries: originCountries,
    original_language: item.original_language || "en",
    platform,
    release_year: year
  }
}

export function normalizeMedia(item: any): CardItem {
  if (item.media_type === "movie" || item.title) {
    return normalizeMovies(item)
  }
  return normalizeSeries(item)
}