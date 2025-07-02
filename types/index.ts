export interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image_url: string
  badge?: string
  badgeColor?: string
  description?: string
  ingredients?: string[]
  howToUse?: string
  benefits?: string[]
  skinType?: string
  category?: string
  concerns?: string[]
}

export interface CartItem extends Product {
  quantity: number
}

export interface RecommendationRequest {
  skinType: string
  concerns: string[]
  budget: string
  preferences: string
  age: string
  routine: string
}

export interface Recommendation {
  product: Product
  reason: string
  matchScore: number
}

export type PageType = "home" | "product" | "cart" | "login" | "signup" | "ai-recommendations" | "search"
