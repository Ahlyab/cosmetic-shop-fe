import type { Product, RecommendationRequest, Recommendation } from "../types"

export const generateRecommendations = async (
  form: RecommendationRequest,
  products: Product[],
): Promise<Recommendation[]> => {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const userConcerns = form.concerns
  const userSkinType = form.skinType.toLowerCase()
  const userBudget = form.budget

  const scoredProducts = products.map((product) => {
    let score = 0
    const reasons = []

    // Match skin type
    if (product.skinType?.toLowerCase().includes(userSkinType) || product.skinType?.includes("All skin types")) {
      score += 30
      reasons.push(`Perfect for ${userSkinType} skin`)
    }

    // Match concerns
    const matchingConcerns =
      product.concerns?.filter((concern) =>
        userConcerns.some(
          (userConcern) =>
            concern.toLowerCase().includes(userConcern.toLowerCase()) ||
            userConcern.toLowerCase().includes(concern.toLowerCase()),
        ),
      ) || []

    if (matchingConcerns.length > 0) {
      score += matchingConcerns.length * 25
      reasons.push(`Addresses your ${matchingConcerns.join(", ")} concerns`)
    }

    // Budget consideration
    if (userBudget === "budget" && product.price < 40) {
      score += 20
      reasons.push("Budget-friendly option")
    } else if (userBudget === "mid-range" && product.price >= 30 && product.price <= 60) {
      score += 20
      reasons.push("Great value for money")
    } else if (userBudget === "premium" && product.price > 50) {
      score += 20
      reasons.push("Premium quality product")
    }

    // High rating bonus
    if (product.rating >= 4.7) {
      score += 15
      reasons.push("Highly rated by customers")
    }

    return {
      product,
      reason: reasons.join(" • "),
      matchScore: score,
    }
  })

  // Sort by score and take top recommendations
  return scoredProducts
    .filter((item) => item.matchScore > 20)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
}

export const getPersonalizedTips = (form: RecommendationRequest): string[] => {
  const tips = []

  if (form.skinType === "Oily") {
    tips.push("• Use products with salicylic acid or niacinamide to control oil production")
  }
  if (form.skinType === "Dry") {
    tips.push("• Look for ingredients like hyaluronic acid and ceramides for deep hydration")
  }
  if (form.concerns.includes("Dark spots")) {
    tips.push("• Always use SPF 30+ during the day when using brightening products")
  }
  if (form.concerns.includes("Wrinkles")) {
    tips.push("• Start with lower concentrations of retinol and gradually increase usage")
  }

  tips.push("• Patch test new products on a small area before full application")
  tips.push("• Introduce new products one at a time to monitor your skin's reaction")

  return tips
}
