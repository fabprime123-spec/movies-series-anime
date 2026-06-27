import { CardItem } from "../types/card.type"
import { classifyMedia } from "./classifier"

export function groupByCategory(
  items: any[]
) {

  const result: Record<string, CardItem[]> = {}

  items.forEach(item => {
    const classified = classifyMedia(item)

    classified.categories.forEach((category) => {
      if (!result[category])
        result[category] = []
      result[category].push(item)
    })
  })

  return result
}