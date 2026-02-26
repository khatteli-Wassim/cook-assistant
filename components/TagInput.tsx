'use client'
import { useState, KeyboardEvent, useRef } from 'react'

const SUGGESTIONS = [
  'tomatoes', 'onions', 'garlic', 'eggs', 'butter', 'milk', 'flour', 'sugar',
  'salt', 'pepper', 'olive oil', 'chicken', 'beef', 'pasta', 'rice', 'potatoes',
  'carrots', 'spinach', 'cheese', 'cream', 'lemon', 'bread', 'mushrooms',
  'bell pepper', 'zucchini', 'eggplant', 'tuna', 'salmon', 'shrimp', 'bacon',
  'ham', 'sausage', 'yogurt', 'cucumber', 'lettuce', 'avocado', 'corn',
  'broccoli', 'cauliflower', 'peas', 'beans', 'lentils', 'chickpeas', 'tofu',
  'soy sauce', 'vinegar', 'honey', 'paprika', 'cumin', 'coriander', 'turmeric',
  'cinnamon', 'ginger', 'parsley', 'basil', 'oregano', 'thyme', 'rosemary',
]

interface Props {
  tags: string[]
  onChange: (tags: string[]) => void
}

export default function TagInput({ tags, onChange }: Props) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIdx, setHighlightedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = input.trim().length > 0
    ? SUGGESTIONS.filter(s =>
        s.toLowerCase().startsWith(input.toLowerCase()) &&
        !tags.includes(s)
      ).slice(0, 6)
    : []

  const addTag = (val: string) => {
    const clean = val.trim().replace(/,$/, '')
    if (clean && !tags.includes(clean)) {
      onChange([...tags, clean])
    }
    setInput('')
    setShowSuggestions(false)
    setHighlightedIdx(0)
    inputRef.current?.focus()
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag))
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIdx(i => Math.min(i + 1, filtered.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIdx(i => Math.max(i - 1, 0))
      return
    }
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (filtered.length > 0 && showSuggestions) {
        addTag(filtered[highlightedIdx])
      } else if (input.trim()) {
        addTag(input)
      }
      return
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false)
      return
    }
    if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Tags + input in one unified box */}
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 6,
          padding: '10px 12px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          minHeight: 46, cursor: 'text',
          transition: 'border-color 0.2s',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map(tag => (
          <div key={tag} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 10px',
            background: 'rgba(232,184,109,0.15)',
            border: '1px solid rgba(232,184,109,0.3)',
            borderRadius: 20, fontSize: 12, color: 'var(--accent)',
          }}>
            {tag}
            <span
              onClick={e => { e.stopPropagation(); removeTag(tag) }}
              style={{
                cursor: 'pointer', color: 'var(--accent2)',
                fontSize: 15, lineHeight: 1, opacity: 0.8,
              }}
            >×</span>
          </div>
        ))}

        <input
          ref={inputRef}
          value={input}
          onChange={e => {
            setInput(e.target.value)
            setShowSuggestions(true)
            setHighlightedIdx(0)
          }}
          onKeyDown={handleKey}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={tags.length === 0 ? 'e.g. tomatoes, eggs, butter…' : 'add more…'}
          style={{
            border: 'none', outline: 'none',
            background: 'transparent',
            color: 'var(--text)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, minWidth: 140, flex: 1,
          }}
        />
      </div>

      {/* Autocomplete dropdown */}
      {showSuggestions && filtered.length > 0 && (
        <div style={{
          position: 'absolute', bottom: '110%', left: 0, right: 0,
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
          zIndex: 50,
          boxShadow: '0 -8px 24px rgba(0,0,0,0.4)',
        }}>
          {filtered.map((s, i) => (
            <div
              key={s}
              onMouseDown={() => addTag(s)}
              style={{
                padding: '10px 14px',
                fontSize: 13,
                cursor: 'pointer',
                background: i === highlightedIdx
                  ? 'rgba(232,184,109,0.12)'
                  : 'transparent',
                color: i === highlightedIdx ? 'var(--accent)' : 'var(--text)',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'background 0.1s',
              }}
              onMouseEnter={() => setHighlightedIdx(i)}
            >
              <span style={{ fontSize: 16 }}>🥕</span>
              {/* Bold the matched part */}
              <span>
                <strong>{s.slice(0, input.length)}</strong>
                {s.slice(input.length)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{
        fontSize: 11, color: 'var(--muted)',
        marginTop: 5, paddingLeft: 2,
      }}>
        Press Enter or comma to add · Backspace to remove last · ↑↓ to navigate
      </div>
    </div>
  )
}