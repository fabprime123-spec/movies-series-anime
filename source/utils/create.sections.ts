import { CardItem } from "../types/card.type"
import { classifyMedia } from "./classifier"
import { sectionNames } from "../constants/sections.name"
import { normalizeMedia } from "./normalize"

export function createSections(items: any[]) {

  const sectionMap: Record<string, CardItem[]> = {}

  items.forEach(item => {
    const classified = classifyMedia(item)
    const card = normalizeMedia(item)

    const keys = [
      ...classified.categories,
      ...classified.genres
    ]

    keys.forEach(key => {
      if (!sectionMap[key]) { sectionMap[key] = [] }

      const exists = sectionMap[key].some(
        entry => entry.id === card.id && entry.type === card.type
      )

      if (!exists) {
        sectionMap[key].push(card)
      }
    })
  })

  return Object.entries(sectionMap)
    .map(([key, data]) => ({
      key: key,
      title: sectionNames[key as keyof typeof sectionNames] ?? key,
      data: data
    }))
    .filter(section => section.data.length >= 3)
}