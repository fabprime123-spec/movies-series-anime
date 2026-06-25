import { useQuery } from "@tanstack/react-query"
import { getTrending } from "../api/trending.api"

export function useTrending() {
  return useQuery({
    queryKey: ["trending"],
    queryFn: getTrending
  })
}