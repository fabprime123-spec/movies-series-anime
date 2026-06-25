import { CardItem } from "../types/card.type"
import { Movies } from "../types/movies.type"
import { Series } from "../types/series.type"


export function normalizeMovie(item: Movies): CardItem {
  return {
    id: item.id,
    title: item.title,
    poster: item.poster_path,
    backdrop: item.backdrop_path,
    release_date: item.release_date?.slice(0, 4),
    rating: item.vote_average,
    type: "movie"
  }
}

export function normalizeSeries(item: Series): CardItem {
  return {
    id: item.id,
    title: item.name,
    poster: item.poster_path,
    backdrop: item.backdrop_path,
    release_date: item.first_air_date?.slice(0, 4),
    rating: item.vote_average,
    type: "series"
  }
}

export function normalizeTrending(item: any): CardItem {
  return {
    id: item.id,
    title: item.title || item.name,
    poster: item.poster_path,
    backdrop: item.backdrop_path,
    release_date: item.release_date,
    rating: item.vote_average,
    type: item.media_type === "movie" ? "movie" : "series"
  }
}