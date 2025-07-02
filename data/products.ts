import type { Product } from "../types"

export const categories = [
  { name: "Skincare", icon: "✨", color: "bg-pink-100 text-pink-700" },
  { name: "Makeup", icon: "💄", color: "bg-purple-100 text-purple-700" },
  { name: "Hair Care", icon: "💇‍♀️", color: "bg-blue-100 text-blue-700" },
  { name: "Wellness", icon: "🌿", color: "bg-green-100 text-green-700" },
  { name: "Fragrance", icon: "🌸", color: "bg-rose-100 text-rose-700" },
  { name: "Men's Care", icon: "🧔", color: "bg-gray-100 text-gray-700" },
]

export const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Vitamin C Brightening Serum",
    brand: "GlowLab",
    price: 45.99,
    originalPrice: 59.99,
    rating: 4.8,
    reviews: 324,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Best Seller",
    badgeColor: "bg-orange-500",
    category: "skincare",
    concerns: ["dark spots", "dullness", "uneven tone"],
    description:
      "Transform your skin with our powerful Vitamin C Brightening Serum. This advanced formula combines 20% L-Ascorbic Acid with hyaluronic acid to deliver maximum brightening results while deeply hydrating your skin. Perfect for reducing dark spots, evening skin tone, and achieving that coveted healthy glow.",
    ingredients: ["20% L-Ascorbic Acid", "Hyaluronic Acid", "Vitamin E", "Ferulic Acid", "Aloe Vera Extract"],
    howToUse:
      "Apply 2-3 drops to clean, dry skin every morning. Gently pat until absorbed. Follow with moisturizer and SPF 30+ sunscreen. Start with every other day if you have sensitive skin.",
    benefits: [
      "Brightens skin tone",
      "Reduces dark spots",
      "Boosts collagen production",
      "Provides antioxidant protection",
    ],
    skinType: "All skin types, especially dull or uneven skin tone",
  },
  {
    id: 2,
    name: "Hydrating Face Moisturizer",
    brand: "AquaGlow",
    price: 32.5,
    rating: 4.6,
    reviews: 189,
    image: "/placeholder.svg?height=300&width=300",
    badge: "New",
    badgeColor: "bg-green-500",
    category: "skincare",
    concerns: ["dryness", "dehydration", "fine lines"],
    description:
      "Experience 24-hour hydration with our lightweight, non-greasy moisturizer. Formulated with a powerful blend of hyaluronic acid and ceramides, this moisturizer locks in moisture while strengthening your skin's natural barrier. Perfect for daily use on all skin types.",
    ingredients: ["Hyaluronic Acid", "Ceramides", "Niacinamide", "Squalane", "Peptides"],
    howToUse:
      "Apply to clean face and neck morning and evening. Gently massage in upward circular motions until fully absorbed. Can be used under makeup or as a night treatment.",
    benefits: ["24-hour hydration", "Strengthens skin barrier", "Reduces fine lines", "Non-comedogenic"],
    skinType: "All skin types, especially dry or dehydrated skin",
  },
  {
    id: 3,
    name: "Retinol Night Cream",
    brand: "YouthRenew",
    price: 78.0,
    originalPrice: 95.0,
    rating: 4.9,
    reviews: 456,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Premium",
    badgeColor: "bg-purple-500",
    category: "skincare",
    concerns: ["aging", "wrinkles", "fine lines", "texture"],
    description:
      "Turn back time with our advanced Retinol Night Cream. This premium anti-aging treatment contains 0.5% pure retinol combined with nourishing peptides and shea butter to reduce fine lines, improve skin texture, and promote cellular renewal while you sleep.",
    ingredients: ["0.5% Pure Retinol", "Peptide Complex", "Shea Butter", "Vitamin E", "Jojoba Oil"],
    howToUse:
      "Apply to clean skin at night only. Start with 2-3 times per week, gradually increasing frequency. Always use SPF during the day when using retinol products. Avoid eye area.",
    benefits: [
      "Reduces fine lines and wrinkles",
      "Improves skin texture",
      "Promotes cell turnover",
      "Firms and tightens skin",
    ],
    skinType: "Mature skin, normal to dry skin types",
  },
  {
    id: 4,
    name: "Gentle Cleansing Foam",
    brand: "PureSkin",
    price: 24.99,
    rating: 4.7,
    reviews: 278,
    image: "/placeholder.svg?height=300&width=300",
    badge: "Organic",
    badgeColor: "bg-green-600",
    category: "skincare",
    concerns: ["sensitivity", "irritation", "makeup removal"],
    description:
      "Start your skincare routine right with our Gentle Cleansing Foam. This organic formula effectively removes makeup, dirt, and impurities without stripping your skin's natural oils. Enriched with soothing botanicals for a clean, refreshed feeling.",
    ingredients: ["Coconut-derived Surfactants", "Chamomile Extract", "Aloe Vera", "Green Tea Extract", "Glycerin"],
    howToUse:
      "Wet face with lukewarm water. Pump 1-2 times into palm and work into a rich lather. Massage gently over face and neck, then rinse thoroughly. Use morning and evening.",
    benefits: [
      "Removes makeup and impurities",
      "Maintains skin's pH balance",
      "Soothes and calms skin",
      "Suitable for sensitive skin",
    ],
    skinType: "All skin types, especially sensitive skin",
  },
]
