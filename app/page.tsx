'use client'
import { useState, useRef, useEffect } from 'react'
import Header from '@/components/Header'
import Message, { MessageType } from '@/components/Message'
import InputBar from '@/components/InputBar'
import TypingIndicator from '@/components/TypingIndicator'
import { Mode, getRecommendation } from '@/lib/api'

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Marhba! 👋 I\'m your AI kitchen assistant. What would you like to do today?',
      showModeChips: true,
      chipsLocked: false,
    }
  ])
  const [mode, setMode] = useState<Mode | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [selectedMode, setSelectedMode] = useState<Mode | undefined>(undefined)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, tags])

  const addMessage = (msg: MessageType) => {
    setMessages(prev => [...prev, msg])
  }

  const cleanupAfterLastChips = () => {
    setMessages(prev => {
      const lastChipIdx = prev.map((m, i) => ({ m, i }))
        .filter(({ m }) => m.showModeChips)
        .pop()?.i ?? -1
      return prev.slice(0, lastChipIdx + 1)
    })
  }

  const lockChips = (chosenMode: Mode) => {
    setMessages(prev => prev.map(m =>
      m.showModeChips && !m.chipsLocked
        ? { ...m, chipsLocked: true, selectedMode: chosenMode }
        : m
    ))
  }

  const handleModeSelect = (selected: Mode) => {
    if (isTyping) return

    cleanupAfterLastChips()
    setMode(selected)
    setSelectedMode(selected)
    setTags([])

    if (selected === 'propose_meal') {
      lockChips(selected)
      addMessage({
        id: 'user-propose-' + Date.now(),
        role: 'user',
        text: '✨ Surprise me with a meal!',
      })
      callAPI({ mode: selected })
      return
    }

    if (selected === 'meal_to_ingredients') {
      setTimeout(() => addMessage({
        id: 'prompt-' + Date.now(),
        role: 'bot',
        text: 'Great! Type the meal name below and hit send.',
      }), 50)
    }

    // ingredients_to_meals — no message, tag input shows in bottom bar only
  }

  const callAPI = async (payload: Parameters<typeof getRecommendation>[0]) => {
    setIsTyping(true)
    try {
      const result = await getRecommendation(payload)
      addMessage({
        id: 'result-' + Date.now(),
        role: 'bot',
        recipeData: { data: result.data, intent: result.intent },
      })
    } catch {
      addMessage({
        id: 'error-' + Date.now(),
        role: 'bot',
        text: '⚠️ Something went wrong. Make sure your backend is running!',
      })
    } finally {
      setIsTyping(false)
      setMode(null)
      setSelectedMode(undefined)
      setTags([])
      offerReset()
    }
  }

  const offerReset = () => {
    setTimeout(() => {
      addMessage({
        id: 'reset-' + Date.now(),
        role: 'bot',
        text: 'Want to try something else?',
        showModeChips: true,
        chipsLocked: false,
      })
    }, 400)
  }

  const handleSend = async (text: string) => {
    if (!mode || mode !== 'meal_to_ingredients') return
    lockChips(mode)
    addMessage({
      id: 'user-meal-' + Date.now(),
      role: 'user',
      text: `🍽️ ${text}`,
    })
    await callAPI({ mode: 'meal_to_ingredients', meal: text })
  }

  const handleSendTags = async () => {
    if (tags.length === 0) {
      addMessage({
        id: 'warn-' + Date.now(),
        role: 'bot',
        text: 'Please add at least one ingredient first!',
      })
      return
    }
    lockChips('ingredients_to_meals')
    addMessage({
      id: 'user-tags-' + Date.now(),
      role: 'user',
      text: `🥕 My ingredients: ${tags.join(', ')}`,
    })
    const savedTags = [...tags]
    setTags([])
    await callAPI({ mode: 'ingredients_to_meals', ingredients: savedTags })
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
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      <InputBar
        onSend={handleSend}
        onSendTags={handleSendTags}
        mode={mode}
        disabled={isTyping}
        tags={tags}
        onTagChange={setTags}
      />
    </div>
  )
}