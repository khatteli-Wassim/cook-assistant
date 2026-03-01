'use client'
import { useState, useRef, useEffect } from 'react'
import Header from '@/components/Header'
import Message, { MessageType } from '@/components/Message'
import InputBar from '@/components/InputBar'
import { streamChat, Message as APIMessage } from '@/lib/api'

const WELCOME: MessageType = {
  id: 'welcome',
  role: 'bot',
  text: "Hey! 👋 I'm Chef AI — your personal cooking assistant.\n\nI can help you with **recipes**, **meal ideas**, **nutrition info**, and even help you **find ingredients** at the best price near you.\n\nJust talk to me naturally — what's on your mind?",
}

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([WELCOME])
  const [history, setHistory] = useState<APIMessage[]>([])
  const [location, setLocation] = useState<string>('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (msg: MessageType) => {
    setMessages(prev => [...prev, msg])
  }

  const sendMessage = async (text: string) => {
    if (isStreaming || !text.trim()) return

    const userMsg: MessageType = {
      id: 'user-' + Date.now(),
      role: 'user',
      text,
    }
    addMessage(userMsg)

    const botId = 'bot-' + Date.now()
    setMessages(prev => [...prev, {
      id: botId,
      role: 'bot',
      text: '',
      isStreaming: true,
    }])
    setIsStreaming(true)

    const updatedHistory: APIMessage[] = [
      ...history,
      { role: 'user', content: text }
    ]

    try {
      let fullResponse = ''

      await streamChat(
        text,
        history,
        (chunk: string) => {
          fullResponse += chunk
          setMessages(prev => prev.map(m =>
            m.id === botId ? { ...m, text: fullResponse } : m
          ))
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        },
        () => {
          setMessages(prev => prev.map(m =>
            m.id === botId ? { ...m, isStreaming: false } : m
          ))
          setHistory([
            ...updatedHistory,
            { role: 'assistant', content: fullResponse }
          ])

          // Extract location if AI asked for it
          if (fullResponse.includes('your city') || fullResponse.includes('your location')) {
            // next user message will be treated as location
            setMessages(prev => [...prev])
          }

          setIsStreaming(false)
        },
        location || undefined
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

  // Detect if user is providing location in response to grocery agent
  const handleSend = (text: string) => {
    const lastBotMsg = [...messages].reverse().find(m => m.role === 'bot')
    const askedForLocation = lastBotMsg?.text?.includes('your city') ||
      lastBotMsg?.text?.includes('your location') ||
      lastBotMsg?.text?.includes('📍')

    if (askedForLocation && !location) {
      setLocation(text)
    }

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
            <Message key={msg.id} message={msg} />
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