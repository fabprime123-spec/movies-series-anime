import { Movies } from "../types/movies.type"
import { tmdb } from "./client"

export async function getNowPlayingMovies(): Promise<Movies[]> {
  const response = await tmdb.get("/movie/now_playing")
  return response.data.results
}

export async function getPopularMovies(): Promise<Movies[]> {
  const response = await tmdb.get("/movie/popular")
  return response.data.results
}

export async function getTopRatedMovies(): Promise<Movies[]> {
  const response = await tmdb.get("/movie/top_rated")
  return response.data.results
}

export async function getUpcomingMovies(): Promise<Movies[]> {
  const response = await tmdb.get("/movie/upcoming")
  return response.data.results
}