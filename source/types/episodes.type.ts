export interface Episode {
  id: number
  name: string
  overview: string
  air_date: string | null
  episode_number: number
  season_number: number
  runtime: number | null
  still_path: string | null
  vote_average: number
  vote_count: number
}