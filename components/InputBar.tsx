'use client'
import { useState, KeyboardEvent } from 'react'

interface Props {
  onSend: (text: string) => void
  disabled: boolean
}

export default function InputBar({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (disabled || !value.trim()) return
    onSend(value.trim())
    setValue('')
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{
      position: 'relative', zIndex: 10,
      borderTop: '1px solid var(--border)',
      background: 'rgba(15,14,12,0.9)',
      backdropFilter: 'blur(12px)',
      padding: '14px 16px',
    }}>
      <div style={{
        maxWidth: 720, margin: '0 auto',
        display: 'flex', gap: 10, alignItems: 'flex-end',
      }}>
        <div style={{
          flex: 1,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '10px 14px',
          display: 'flex', alignItems: 'center',
        }}>
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder={disabled ? 'Chef AI is thinking…' : 'Ask me anything about cooking…'}
            disabled={disabled}
            rows={1}
            style={{
              flex: 1, background: 'transparent',
              border: 'none', outline: 'none',
              color: 'var(--text)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, resize: 'none',
              maxHeight: 120, lineHeight: 1.5,
              opacity: disabled ? 0.5 : 1,
            }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          style={{
            width: 38, height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            border: 'none',
            cursor: (disabled || !value.trim()) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            opacity: (disabled || !value.trim()) ? 0.4 : 1,
            transition: 'transform 0.15s, opacity 0.15s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f0e0c">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
          </svg>
        </button>
      </div>

      <div style={{
        textAlign: 'center', fontSize: 11,
        color: 'var(--muted)', marginTop: 8,
      }}>
        Press Enter to send · Shift+Enter for new line
      </div>
    </div>
  )
}