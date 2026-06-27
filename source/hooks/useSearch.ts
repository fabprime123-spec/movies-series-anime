import { useQuery } from "@tanstack/react-query"
import { searchQuery } from "../api/search.api"

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchQuery(query),
    enabled: query.trim().length > 0
  })
}