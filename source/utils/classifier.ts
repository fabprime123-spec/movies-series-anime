import { ContentCategory } from "../types/category.type"
import { Genre } from "../types/genre.type"
import { genres } from "../constants/genres"

interface Classified {
  categories: ContentCategory[]
  genres: Genre[]
}

export function classifyMedia(item: any): Classified {

  const result: Classified = {
    categories: [],
    genres: []
  }
  const genreIds = item.genre_ids ?? item.genres?.map((g: any) => g.id) ?? []
  const countries = item.origin_country ?? item.production_countries?.map((c: any) => c.iso_3166_1) ?? []


  // movie
  if (
    item.media_type === "movie" ||
    item.title
  ) {
    result.categories.push("movie")
  }
  // series
  if (
    item.media_type === "tv" ||
    item.name
  ) {
    result.categories.push("series")
  }

  // genres
  genreIds.forEach((id: number) => {
    const genre = genres[id]
    if (genre) {
      result.genres.push(genre)
    }
  })

  // animation + anime
  if (result.genres.includes("animation")) {
    result.categories.push("animation")
    if (countries.includes("JP")) {
      result.categories.push("anime")
    }
  }

  // documentary
  if (
    result.genres.includes("documentary")
  ) {
    result.categories.push("documentary")
  }

  // drama countries
  if (result.genres.includes("drama")) {
    if (countries.includes("KR")) result.categories.push("k_drama")
    if (countries.includes("CN")) result.categories.push("c_drama")
    if (countries.includes("JP")) result.categories.push("j_drama")
    if (
      countries.includes("KR") ||
      countries.includes("CN") ||
      countries.includes("JP")
    ) {
      result.categories.push("asian_drama")
    }
  }

  // reality
  if (result.genres.includes("reality")) {
    result.categories.push("reality")
  }

  return {
    categories: [...new Set(result.categories)],
    genres: [...new Set(result.genres)]
  }
}