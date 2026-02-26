const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export type Mode = 'meal_to_ingredients' | 'ingredients_to_meals' | 'propose_meal'

export interface RecommendationRequest {
  mode: Mode
  meal?: string
  ingredients?: string[]
}

export interface RecipeResult {
  intent: Mode
  data: {
    meal?: string
    name?: string
    ingredients?: string[]
    instructions?: string[]
    meals?: string[]
    descriptions?: string[]
  }
}

export async function getRecommendation(payload: RecommendationRequest): Promise<RecipeResult> {
  const res = await fetch(`${API_URL}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error('API request failed')
  }

  return res.json()
}