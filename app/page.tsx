'use client'
import { useState, useRef, useEffect } from 'react'
import Header from '@/components/Header'
import Message, { MessageType } from '@/components/Message'
import InputBar from '@/components/InputBar'
import TypingIndicator from '@/components/TypingIndicator'
import { streamChat, Message as APIMessage, Mode } from '@/lib/api'

const WELCOME: MessageType = {
  id: 'welcome',
  role: 'bot',
  text: "Marhba! 👋 I'm Chef AI, your personal cooking assistant. I can help you with:\n\n🍽️ **Find a recipe** — just tell me what you want to cook\n🥕 **Use your ingredients** — tell me what you have and I'll suggest meals\n✨ **Surprise you** — ask me to pick something for you\n💬 **Anything food related** — cooking tips, nutrition, techniques\n\nWhat can I help you with today?",
  showModeChips: true,
  chipsLocked: false,
}

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([WELCOME])
  const [history, setHistory] = useState<APIMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [selectedMode, setSelectedMode] = useState<Mode | undefined>()
  const bottomRef = useRef<HTMLDivElement>(null)
  const streamingIdRef = useRef<string | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (msg: MessageType) => {
    setMessages(prev => [...prev, msg])
  }

  const lockChips = (chosenMode: Mode) => {
    setMessages(prev => prev.map(m =>
      m.showModeChips && !m.chipsLocked
        ? { ...m, chipsLocked: true, selectedMode: chosenMode }
        : m
    ))
  }

  const sendMessage = async (text: string, mode?: Mode) => {
    if (isStreaming || !text.trim()) return

    if (mode) {
      lockChips(mode)
      setSelectedMode(mode)
    }

    // Add user message
    const userMsg: MessageType = {
      id: 'user-' + Date.now(),
      role: 'user',
      text,
    }
    addMessage(userMsg)

    // Add empty bot message that will be filled by streaming
    const botId = 'bot-' + Date.now()
    streamingIdRef.current = botId
    const botMsg: MessageType = {
      id: botId,
      role: 'bot',
      text: '',
      isStreaming: true,
    }
    setMessages(prev => [...prev, botMsg])
    setIsStreaming(true)

    // Build history to send
    const updatedHistory: APIMessage[] = [
      ...history,
      { role: 'user', content: text }
    ]

    try {
      let fullResponse = ''

      await streamChat(
        text,
        history,
        (chunk) => {
          fullResponse += chunk
          setMessages(prev => prev.map(m =>
            m.id === botId ? { ...m, text: fullResponse } : m
          ))
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        },
        () => {
          // Streaming done
          setMessages(prev => prev.map(m =>
            m.id === botId ? { ...m, isStreaming: false } : m
          ))
          setHistory([
            ...updatedHistory,
            { role: 'assistant', content: fullResponse }
          ])
          setIsStreaming(false)
          streamingIdRef.current = null

          // Offer chips again after response
          setTimeout(() => {
            addMessage({
              id: 'chips-' + Date.now(),
              role: 'bot',
              text: 'Anything else I can help with?',
              showModeChips: true,
              chipsLocked: false,
            })
          }, 300)
        }
      )
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === botId
          ? { ...m, text: '⚠️ Something went wrong. Make sure the backend is running!', isStreaming: false }
          : m
      ))
      setIsStreaming(false)
    }
  }

  const handleModeSelect = (mode: Mode) => {
    if (isStreaming) return
    const messageMap = {
      meal_to_ingredients: 'I know what I want to cook, give me the recipe 🍽️',
      ingredients_to_meals: 'I have some ingredients and want to know what I can make 🥕',
      propose_meal: 'Surprise me with a random meal! ✨',
    }
    sendMessage(messageMap[mode], mode)
  }

  const handleSend = (text: string) => {
    sendMessage(text)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
    }}>
      <Header />

      <div
        className="chat-scroll"
        style={{
          flex: 1, overflowY: 'auto',
          padding: '24px 16px',
          position: 'relative', zIndex: 1,
        }}
      >
        <div style={{
          maxWidth: 720, margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          {messages.map(msg => (
            <Message
              key={msg.id}
              message={{
                ...msg,
                selectedMode: msg.showModeChips ? selectedMode : undefined,
                onModeSelect: handleModeSelect,
              }}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <InputBar
        onSend={handleSend}
        disabled={isStreaming}
      />
    </div>
  )
}