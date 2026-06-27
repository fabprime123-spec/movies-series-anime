import { tmdb } from "./client"

export async function getTrending() {
  const response = await tmdb.get("/trending/all/day")
  return response.data.results
}