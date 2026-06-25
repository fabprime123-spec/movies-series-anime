import { tmdb } from "./client"

export async function getTrending() {
  const response = await tmdb.get("/trending/all/week")
  return response.data.results
}