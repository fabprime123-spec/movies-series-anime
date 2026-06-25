export type CardItem = {
  id: number
  title: string
  poster: string | null
  backdrop: string | null
  rating: number
  release_date: string
  type: "movie" | "series"
}