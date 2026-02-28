const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export type Mode = 'meal_to_ingredients' | 'ingredients_to_meals' | 'propose_meal'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function streamChat(
  message: string,
  history: Message[],
  onChunk: (chunk: string) => void,
  onDone: () => void
): Promise<void> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })

  if (!response.ok) throw new Error('API request failed')

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) throw new Error('No reader available')

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk: string = decoder.decode(value, { stream: true })
    onChunk(chunk)
  }

  onDone()
}