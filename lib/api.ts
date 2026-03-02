export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function streamChat(
  message: string,
  history: Message[],
  onChunk: (chunk: string) => void,
  onDone: () => void,
  location?: string
): Promise<void> {
  const response = await fetch('/api/chat', {  // ← calls Next.js, not FastAPI
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, location }),
  })

  if (!response.ok) throw new Error('Request failed')

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) throw new Error('No reader')

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    onChunk(decoder.decode(value, { stream: true }))
  }

  onDone()
}