import { useQuery } from "@tanstack/react-query"
import { getGenreMovies } from "../api/category.api"
import { Genre } from "../types/genre.type"

export function useGenreMovies(genre: Genre) {
  return useQuery({
    queryKey: ["genre-movies", genre],
    queryFn: () => getGenreMovies(genre)
  })
}