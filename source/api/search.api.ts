import { tmdb } from "./client"

export async function searchQuery(query: string) {
  if (!query.trim()) return []
  const response = await tmdb.get("/search/multi", {
    params: {
      query: query,
      include_adult: false
    }
  })
  return response.data.results
}