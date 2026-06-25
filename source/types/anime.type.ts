export interface Anime {
  id: number
  title: string
  title_english: string | null
  type: string
  episodes: number | null
  status: string
  score: number | null
  rank: number | null
  popularity: number
  synopsis: string
  genres: string[]
  studios: string[]
  producers: string[]
  country: string
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
}