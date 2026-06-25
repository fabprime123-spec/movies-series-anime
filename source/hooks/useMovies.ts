import { useQuery } from "@tanstack/react-query"

import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies
} from "../api/movies.api"

export function useNowPlayingMovies() {
  return useQuery({
    queryKey: ["movies", "now-playing"],
    queryFn: getNowPlayingMovies
  })
}

export function usePopularMovies() {
  return useQuery({
    queryKey: ["movies", "popular"],
    queryFn: getPopularMovies
  })
}


export function useTopRatedMovies() {
  return useQuery({
    queryKey: ["movies", "top-rated"],
    queryFn: getTopRatedMovies
  })
}


export function useUpcomingMovies() {
  return useQuery({
    queryKey: ["movies", "upcoming"],
    queryFn: getUpcomingMovies
  })
}