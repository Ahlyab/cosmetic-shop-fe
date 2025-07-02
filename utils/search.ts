import type { Product } from "../types"

export const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase().trim()

  return products.filter((product) => {
    // Search in product name
    if (product.name.toLowerCase().includes(searchTerm)) return true

    // Search in brand
    if (product.brand.toLowerCase().includes(searchTerm)) return true

    // Search in description
    if (product.description?.toLowerCase().includes(searchTerm)) return true

    // Search in category
    if (product.category?.toLowerCase().includes(searchTerm)) return true

    // Search in concerns
    if (product.concerns?.some((concern) => concern.toLowerCase().includes(searchTerm))) return true

    // Search in ingredients
    if (product.ingredients?.some((ingredient) => ingredient.toLowerCase().includes(searchTerm))) return true

    // Search in benefits
    if (product.benefits?.some((benefit) => benefit.toLowerCase().includes(searchTerm))) return true

    // Search in skin type
    if (product.skinType?.toLowerCase().includes(searchTerm)) return true

    return false
  })
}

export const getSearchSuggestions = (products: Product[], query: string): string[] => {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase().trim()
  const suggestions = new Set<string>()

  products.forEach((product) => {
    // Add matching brand names
    if (product.brand.toLowerCase().includes(searchTerm)) {
      suggestions.add(product.brand)
    }

    // Add matching product names
    if (product.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(product.name)
    }

    // Add matching categories
    if (product.category?.toLowerCase().includes(searchTerm)) {
      suggestions.add(product.category)
    }

    // Add matching concerns
    product.concerns?.forEach((concern) => {
      if (concern.toLowerCase().includes(searchTerm)) {
        suggestions.add(concern)
      }
    })
  })

  return Array.from(suggestions).slice(0, 5)
}
